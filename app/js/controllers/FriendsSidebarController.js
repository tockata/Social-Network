'use strict';

socialNetworkApp.controller('FriendsSidebarController',
    ['$scope', '$routeParams', 'credentials', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, $routeParams, credentials, friendsData, toaster, defaultProfileImageData) {
        var defaultNotificationTimeout = 2000;
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;

        if(!$routeParams.username || $routeParams.username === $scope.user.username) {
            $scope.username = $scope.user.username;
            friendsData.getLoggedUserFriendsPreview()
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                });
        } else {
            $scope.username = $routeParams.username;
            friendsData.getOtherUserFriendsPreview($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.totalCount = data.totalCount;
                    $scope.friends = data.friends;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                });
        }
    }]);