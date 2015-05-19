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
            friendsData.approveFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Success!', data.message);
                    friendsData.getFriendRequests()
                        .$promise
                        .then(function (data) {
                            $scope.requestsCount = data.length;
                            $scope.requests = data;
                            if($scope.requestsCount === 0) {
                                $scope.requestDetailsShown = false;
                            }
                        });
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function rejectRequest(requestId) {
            friendsData.rejectFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Success!', data.message);
                    friendsData.getFriendRequests()
                        .$promise
                        .then(function (data) {
                            $scope.requestsCount = data.length;
                            $scope.requests = data;
                            if($scope.requestsCount === 0) {
                                $scope.requestDetailsShown = false;
                            }
                        });
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }
    }]);
