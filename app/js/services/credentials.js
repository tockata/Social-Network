'use strict';

socialNetworkApp.factory('credentials',
    ['$sessionStorage', '$localStorage', function ($sessionStorage, $localStorage) {
        var loggedUser = false;

        function saveInLocalStorage(sessionToken, tokenType){
            $localStorage.$default({
                'authorization': tokenType + ' ' + sessionToken
            });
        }

        function saveInSessionStorage(sessionToken, tokenType) {
            $sessionStorage.$default({
                'authorization': tokenType + ' ' + sessionToken
            });
        }

        function deleteCredentials() {
            $localStorage.$reset();
            $sessionStorage.$reset();
            loggedUser = false;
        }

        function checkForSessionToken() {
            return ($sessionStorage.authorization || $localStorage.authorization);
        }

        function getAuthorization() {
            if ($sessionStorage.authorization) {
                return $sessionStorage.authorization;
            } else if ($localStorage.authorization) {
                return $localStorage.authorization;
            }
        }

        function saveLoggedUser(user) {
            loggedUser = user;
        }

        function getLoggedUser() {
            return loggedUser;
        }

        return {
            saveInLocalStorage: saveInLocalStorage,
            saveInSessionStorage: saveInSessionStorage,
            deleteCredentials: deleteCredentials,
            checkForSessionToken: checkForSessionToken,
            getAuthorization: getAuthorization,
            saveLoggedUser: saveLoggedUser,
            getLoggedUser: getLoggedUser
        }
}]);
