'use strict';

socialNetworkApp.controller('EditProfileController',
    ['$scope', '$location', '$timeout', 'userData', 'credentials', 'toaster', function ($scope, $location, $timeout, userData, credentials, toaster){
        if(!credentials.checkForSessionToken()) {
            redirectToHome(0);
        }

        $scope.user = credentials.getLoggedUser();
        $scope.editProfile = editProfile;

        function editProfile(user, editProfileForm) {
            if(user.coverImageData) {
                user.coverImageData = user.coverImageData.base64;
            }

            if(user.profileImageData) {
                user.profileImageData = user.profileImageData.base64;
            }

            userData.edit(user)
                .$promise
                .then(function (data) {
                    $scope.editProfileForm.$setPristine();
                    toaster.pop('success', 'Edit successful!', data.message);
                    redirectToHome(2000);
                }, function (error) {
                    toaster.pop('error', 'Edit profile error!', error.data.message);
                })
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }
    }
    ]);

