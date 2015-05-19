'use strict';

socialNetworkApp.controller('FriendsSidebarController',
    ['$scope', 'friendsData', 'toaster', function ($scope, friendsData, toaster) {
        friendsData.getFriendsPreview()
            .$promise
            .then(function (data) {
                $scope.totalCount = data.totalCount;
                $scope.friends = data.friends.slice(0, 6);
            }, function (error) {
                toaster.pop('error', 'Error!', error.data.message);
            });
    }]);