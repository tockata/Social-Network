'use strict';

socialNetworkApp.controller('EditProfileController',
    ['$scope', '$location', '$timeout', 'userData', 'credentials', 'toaster', function ($scope, $location, $timeout, userData, credentials, toaster){
        $scope.editUser = credentials.getLoggedUser();
        $scope.editProfile = editProfile;
        $scope.formatProfileImgToBase64 = formatProfileImgToBase64;
        $scope.formatCoverImgToBase64 = formatCoverImgToBase64;

        function editProfile(user, editProfileForm) {
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

        function formatProfileImgToBase64() {
            $scope.editUser.profileImageData = 'data:image/jpg;base64,' + $scope.editUser.profileImageData.base64;
        }

        function formatCoverImgToBase64() {
            $scope.editUser.coverImageData = 'data:image/jpg;base64,' + $scope.editUser.coverImageData.base64;
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('/');
            }, time);
        }
    }
    ]);