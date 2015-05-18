'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', '$route', 'userData', 'friendsData', 'credentials', 'toaster', function ($scope, $route, userData, friendsData, credentials, toaster) {
        $scope.user = {};
        $scope.toggleShowRequestsDetail = toggleShowRequestsDetail;
        $scope.requestDetailsShown = false;

        if(credentials.checkForSessionToken()) {
            $scope.isLogged = true;
            userData.getLoggedUserData()
                .$promise
                .then(function (data) {
                    $scope.isLogged = true;
                    saveUserData(data);
                    friendsData.getFriendRequests()
                        .$promise
                        .then(function (data) {
                            $scope.requestsCount = data.length;
                            $scope.requests = data;
                        });
                }, function (error) {
                    $scope.user = {};
                    $scope.isLogged = false;
                });
        }

        function saveUserData(data) {
            $scope.user.id = data.id;
            $scope.user.username = data.username;
            $scope.user.name = data.name;
            $scope.user.email = data.email;
            $scope.user.profileImageData = data.profileImageData;
            $scope.user.gender = data.gender;
            $scope.user.coverImageData = data.coverImageData;
        }

        function toggleShowRequestsDetail() {
            $scope.requestDetailsShown = !$scope.requestDetailsShown;
        }
    }]);
