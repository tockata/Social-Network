'use strict';

socialNetworkApp.controller('FriendsController',
    ['$scope', '$routeParams', '$location', 'credentials', 'userData', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, $routeParams, $location, credentials, userData, friendsData, toaster, defaultProfileImageData) {
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;

        if($routeParams.username === $scope.user.username) {
            $scope.name = $scope.user.name;
            friendsData.getLoggedUserFriends()
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.length;
                    $scope.friends = splitData(data, 2);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        } else {
            userData.getUserFullData($routeParams.username)
                .$promise
                .then(function (data) {
                    if(!data.isFriend) {
                        $location.path('/');
                    }

                    $scope.name = data.name;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });

            friendsData.getOtherUserFriends($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = splitData(data.friends, 2);
                });
        }

        function splitData(array, size) {
            var result = [];
            for (var i=0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        }
    }]);