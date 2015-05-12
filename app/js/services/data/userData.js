socialNetworkApp.factory('userData', ['$resource', 'baseUrl', function ($resource, baseUrl) {
    function loginUser(user) {
        return $resource(baseUrl + 'users/login')
            .save(user);
    }

    function registerUser(user) {
        return $resource(baseUrl + 'users/register')
            .save(user);
    }

    function logoutUser(user) {
        return $resource(baseUrl + 'users/logout')
            .save(user);
    }

    return {
        login: loginUser,
        register: registerUser,
        logout: logoutUser
    }
}]);