'use strict';

socialNetworkApp.controller('UserHeaderController',
    ['$scope', '$location', '$route', 'credentials', 'userData', 'friendsData', function ($scope, $location, $route, credentials, userData, friendsData){
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.user = {};
        $scope.showRequestsDetail = showRequestsDetail;
        $scope.requestDetailsShown = false;
        $scope.searchUsers = searchUsers;
        $scope.searchResultsShown = false;

        userData.getLoggedUserData()
            .$promise
            .then(function (data) {
                $scope.user = data;
                if(!credentials.getLoggedUser()) {
                    credentials.saveLoggedUser(data);
                }

                friendsData.getFriendRequests()
                    .$promise
                    .then(function (data) {
                        $scope.requestsCount = data.length;
                        $scope.requests = data;
                    });
            }, function (error) {
                $scope.user = {};
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
                        $scope.searchResultsShown = true;
                    } else {
                        $scope.searchResults = [];
                        $scope.searchResultsShown = false;
                    }
                }, function (error) {
                    $scope.searchResultsShown = false;
                });
        }
    }
    ]);