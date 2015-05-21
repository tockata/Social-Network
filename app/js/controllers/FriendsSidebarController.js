'use strict';

socialNetworkApp.controller('FriendsSidebarController',
    ['$scope', '$routeParams', 'credentials', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, $routeParams, credentials, friendsData, toaster, defaultProfileImageData) {
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;

        if(!$routeParams.username) {
            friendsData.getFriendsPreview()
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends.slice(0, 6);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        } else {
            friendsData.getOtherUserFriends($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends.slice(0, 6);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }
    }]);