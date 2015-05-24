'use strict';

socialNetworkApp.controller('FriendRequestsController',
    ['$scope', '$route', 'friendsData', 'toaster', 'defaultProfileImageData', function ($scope, $route, friendsData, toaster, defaultProfileImageData) {
        var defaultNotificationTimeout = 2000;
        $scope.acceptRequest = acceptRequest;
        $scope.rejectRequest = rejectRequest;
        $scope.cancel = cancel;
        $scope.defaultProfileImageData = defaultProfileImageData;

        function cancel(requestId) {
            $scope.requestDetailsShown = false;
        }

        function acceptRequest(requestId) {
            friendsData.approveFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Success!', data.message, defaultNotificationTimeout);
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
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                });
        }

        function rejectRequest(requestId) {
            friendsData.rejectFriendRequest(requestId)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Success!', data.message, defaultNotificationTimeout);
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
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                });
        }
    }]);
