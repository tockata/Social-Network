'use strict';

socialNetworkApp.controller('WallController',
    ['$scope', '$routeParams', 'userData', 'friendsData', 'postData', 'credentials', 'toaster', 'defaultProfileImageData', 'defaultCoverImageData', function ($scope, $routeParams, userData, friendsData, postData, credentials, toaster, defaultProfileImageData, defaultCoverImageData) {
        $scope.user = credentials.getLoggedUser();
        $scope.submitPost = submitPost;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.defaultProfileImageData = defaultProfileImageData;

        userData.getUserFullData($routeParams.username)
            .$promise
            .then(function (data) {
                $scope.userData = data;
                if($scope.user.username === $routeParams.username || $scope.userData.isFriend === true) {
                    $scope.isFriendOrLoggedUser = true;
                    $scope.wallOwner = $scope.userData.username;
                }

                if(!$scope.userData.coverImageData) {
                    $scope.userData.coverImageData = defaultCoverImageData;
                }

                if($scope.userData.isFriend) {
                    $scope.buttonName = 'Friend';
                    $scope.disabledButton = 'disabled';
                } else if (
                    !$scope.userData.isFriend
                    && $scope.userData.hasPendingRequest
                    && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Pending request';
                        $scope.disabledButton = 'disabled';
                } else if(
                    !$scope.userData.isFriend
                    && !$scope.userData.hasPendingReques
                    && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Invite';
                } else {
                    $scope.buttonName = 'My wall';
                    $scope.disabledButton = 'disabled';
                }

            }, function (error) {
                toaster.pop('error', 'Error!', error.data.message);
            });

        function submitPost(postContent) {
            var post = {
                postContent: postContent,
                username: $scope.wallOwner
            };

            postData.addPost(post)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Post successfully added!', data.message);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }

        function sendFriendRequest(username) {
            friendsData.sendFriendRequest(username)
                .$promise
                .then(function (data) {
                    toaster.pop('success', 'Success!', data.message);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }
    }]);

