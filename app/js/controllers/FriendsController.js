'use strict';

socialNetworkApp.controller('FriendsController',
    ['$scope', '$routeParams', 'credentials', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, $routeParams, credentials, friendsData, toaster, defaultProfileImageData) {
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;

        if($routeParams.username === $scope.user.username) {
            friendsData.getLoggedUserFriends()
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.length;
                    $scope.friends = splitData(data, 2);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        } else {
            friendsData.getOtherUserFriends($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.length;
                    $scope.friends = splitData(data.friends, 2);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
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