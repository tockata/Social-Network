'use strict';

socialNetworkApp.controller('FriendsSidebarController',
    ['$scope', 'credentials', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, credentials, friendsData, toaster, defaultProfileImageData) {
        $scope.userName = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;

        friendsData.getFriendsPreview()
            .$promise
            .then(function (data) {
                $scope.totalCount = data.totalCount;
                $scope.friends = data.friends.slice(0, 6);
            }, function (error) {
                toaster.pop('error', 'Error!', error.data.message);
            });
    }]);