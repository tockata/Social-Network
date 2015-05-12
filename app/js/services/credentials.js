socialNetworkApp.factory('credentials',
    ['$sessionStorage', '$localStorage', function ($sessionStorage, $localStorage) {
        function saveInLocalStorage(sessionToken, tokenType){
            $localStorage.$default({
                'access_token': sessionToken,
                'token_type': tokenType
            });
        }

        function saveInSessionStorge(sessionToken, tokenType) {
            $sessionStorage.$default({
                'access_token': sessionToken,
                'token_type': tokenType
            });
        }

        function deleteCredentials() {
            $localStorage.$reset();
            $sessionStorage.$reset();
        }

        return {
            saveInLocalStorage: saveInLocalStorage,
            saveInSessionStorage: saveInSessionStorge,
            deleteCredentials: deleteCredentials
        }
}]);
