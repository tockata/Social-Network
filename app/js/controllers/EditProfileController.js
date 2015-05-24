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
                    toaster.pop('success', 'Edit successful!', data.message, 2000);
                    $scope.editUser.name = user.name;
                    $scope.editUser.email = user.email;
                    $scope.editUser.profileImageData = user.profileImageData;
                    $scope.editUser.coverImageData = user.coverImageData;
                    $scope.editUser.gender = user.gender;
                    redirectToWall($scope.editUser.username, 2000);
                }, function (error) {
                    toaster.pop('error', 'Edit profile error!', error.data.message, 2000);
                })
        }

        function formatProfileImgToBase64() {
            $scope.editUserData.profileImageData = 'data:image/jpg;base64,' + $scope.editUserData.profileImageData.base64;
        }

        function formatCoverImgToBase64() {
            $scope.editUserData.coverImageData = 'data:image/jpg;base64,' + $scope.editUserData.coverImageData.base64;
        }

        function redirectToWall(user, time) {
            $timeout(function () {
                $location.path('/users/' + user);
            }, time);
        }
    }
    ]);