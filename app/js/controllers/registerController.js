socialNetworkApp.controller('registerController',
    ['$scope', 'userData', 'credentials', function ($scope, userData, credentials) {
        $scope.register = register;

        function register(user, registerForm) {
            userData.register(user)
                .$promise
                .then(function (data) {
                    $scope.user = {};
                    credentials.saveInSessionStorage(data.access_token, data.token_type);
                    $scope.registerForm.$setPristine();
                }, function (error) {
                    console.log(error.statusText);
                })
        }
}]);