'use strict';

socialNetworkApp.controller('FriendRequestsController',
    ['$scope', 'friendsData', 'toaster', function ($scope, friendsData, toaster) {
        $scope.acceptRequest = acceptRequest;
        $scope.rejectRequest = rejectRequest;
        $scope.cancel = cancel;

        function cancel(requestId) {
            $scope.requestDetailsShown = false;
        }

        function acceptRequest(requestId) {

        }

        function rejectRequest(requestId) {

        }
    }]);
