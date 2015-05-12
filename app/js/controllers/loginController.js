socialNetworkApp.controller('loginController',
    ['$scope', 'userData', 'credentials', function ($scope, userData, credentials) {
        $scope.rememberMe = false;
        $scope.login = login;

        function login(user, loginForm) {
            userData.login(user)
                .$promise
                .then(function (data) {
                    $scope.user = {};
                    if ($scope.rememberMe) {
                        $scope.$storage = credentials.saveInLocalStorage(data.access_token, data.token_type);
                    } else {
                        $scope.$storage = credentials.saveInSessionStorage(data.access_token, data.token_type);
                    }

                    $scope.loginForm.$setPristine();
                }, function (error) {
                    console.log(error.statusText);
                })
        }
}]);
