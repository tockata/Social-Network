'use strict';

socialNetworkApp.controller('UserHeaderController',
    ['$scope', '$location', '$route', '$timeout', 'credentials', 'userData', 'friendsData', 'defaultProfileImageData', function ($scope, $location, $route, $timeout, credentials, userData, friendsData, defaultProfileImageData){
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        if(!credentials.checkForSessionToken()) {
            redirectToHome(0);
        }

        $scope.showRequestsDetail = showRequestsDetail;
        $scope.requestDetailsShown = false;
        $scope.searchUsers = searchUsers;
        $scope.searchResultsShown = false;
        $scope.defaultProfileImageData = defaultProfileImageData;

        if(!credentials.getLoggedUser()) {
            userData.getLoggedUserData()
                .$promise
                .then(function (data) {
                    $scope.user = data;
                    credentials.saveLoggedUser(data);
                }, function (error) {
                    $scope.user = {};
                    credentials.deleteCredentials();
                    $route.reload();
                });
        } else {
            $scope.user = credentials.getLoggedUser();
        }

        friendsData.getFriendRequests()
            .$promise
            .then(function (data) {
                $scope.requestsCount = data.length;
                $scope.requests = data;
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