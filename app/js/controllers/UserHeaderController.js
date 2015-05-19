'use strict';

socialNetworkApp.controller('UserHeaderController',
    ['$scope', '$location', '$route', 'credentials', 'userData', 'friendsData', function ($scope, $location, $route, credentials, userData, friendsData){
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.user = {};
        $scope.showRequestsDetail = showRequestsDetail;
        $scope.requestDetailsShown = false;

        userData.getLoggedUserData()
            .$promise
            .then(function (data) {
                $scope.user = data;
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
    }
    ]);