'use strict';

socialNetworkApp.controller('LogoutController',
    ['$scope', '$location', '$timeout', 'userData', 'credentials', 'toaster', function ($scope, $location, $timeout, userData, credentials, toaster){
        if(!credentials.checkForSessionToken()) {
            redirectToHome(0);
            return;
        }

        $scope.logoutUser = logoutUser;
        $scope.logoutUser();

        function logoutUser() {
            userData.logout()
                .$promise
                .then(function (data) {
                    credentials.deleteCredentials();
                    toaster.pop('success', 'Logout successful!');
                    redirectToHome(3000);
                }, function (error) {
                    toaster.pop('error', 'Logout error!', error.data.message);
                    redirectToHome(3000);
                })

        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }

    }
]);
