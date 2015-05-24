'use strict';

socialNetworkApp.controller('UserHeaderController',
    ['$scope', '$location', '$route', '$timeout', 'credentials', 'userData', 'friendsData', 'defaultProfileImageData', 'toaster', function ($scope, $location, $route, $timeout, credentials, userData, friendsData, defaultProfileImageData, toaster){
        var defaultNotificationTimeout = 2000;
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.user = credentials.getLoggedUser();

        $scope.showRequestsDetail = showRequestsDetail;
        $scope.requestDetailsShown = false;
        $scope.searchUsers = searchUsers;
        $scope.searchResultsShown = false;
        $scope.defaultProfileImageData = defaultProfileImageData;

        friendsData.getFriendRequests()
            .$promise
            .then(function (data) {
                $scope.requestsCount = data.length;
                $scope.requests = data;
            }, function (error) {
                toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                credentials.deleteCredentials();
                $route.reload();
            });

        function showRequestsDetail() {
            if($scope.requestsCount) {
                $scope.requestDetailsShown = true;
            }
        }

        function searchUsers(searchTerm) {
            userData.searchUsersByName(searchTerm)
                .$promise
                .then(function (data) {
                    if(data.length) {
                        $scope.searchResults = data;
                        $scope.searchResultsCount = data.length;
                        $scope.searchResultsShown = true;
                    } else {
                        $scope.searchResults = [];
                        $scope.searchResultsShown = false;
                    }
                }, function (error) {
                    $scope.searchResultsShown = false;
                });
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }
    }
    ]);