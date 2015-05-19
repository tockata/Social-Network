'use strict';

socialNetworkApp.factory('credentials',
    ['$sessionStorage', '$localStorage', function ($sessionStorage, $localStorage) {
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

        return {
            saveInLocalStorage: saveInLocalStorage,
            saveInSessionStorage: saveInSessionStorage,
            deleteCredentials: deleteCredentials,
            checkForSessionToken: checkForSessionToken,
            getAuthorization: getAuthorization
        }
}]);
