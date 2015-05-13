'use strict';

socialNetworkApp.factory('credentials',
    ['$sessionStorage', '$localStorage', function ($sessionStorage, $localStorage) {
        function saveInLocalStorage(sessionToken, tokenType){
            $localStorage.$default({
                'access_token': sessionToken,
                'token_type': tokenType
            });
        }

        function saveInSessionStorage(sessionToken, tokenType) {
            $sessionStorage.$default({
                'access_token': sessionToken,
                'token_type': tokenType
            });
        }

        function deleteCredentials() {
            $localStorage.$reset();
            $sessionStorage.$reset();
        }

        function checkAuthorization() {
            if ($sessionStorage.access_token || $localStorage.access_token) {
                return true;
            }

            return false;
        }

        return {
            saveInLocalStorage: saveInLocalStorage,
            saveInSessionStorage: saveInSessionStorage,
            deleteCredentials: deleteCredentials,
            isLogged: checkAuthorization
        }
}]);
