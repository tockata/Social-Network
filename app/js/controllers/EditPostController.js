'use strict';

socialNetworkApp.controller('EditPostController',
    ['$scope', 'postData', 'toaster', function ($scope, postData, toaster) {
        var defaultNotificationTimeout = 2000;
        $scope.editPostFormShown = false;
        $scope.editPostFormPostId = null;
        $scope.showEditPostForm = showEditPostForm;
        $scope.closeEditPostForm = closeEditPostForm;
        $scope.editPost = editPost;

        function showEditPostForm(postId) {
            $scope.editPostFormShown = true;
            $scope.editPostFormPostId = postId;
        }

        function closeEditPostForm(){
            $scope.editPostFormShown = false;
            $scope.editPostFormPostId = null;
        }

        function editPost(postId, postContent) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId && $scope.user.username == post.author.username) {
                    postData.editPost(postId, postContent)
                        .$promise
                        .then(function (data) {
                            $scope.editPostFormShown = false;
                            $scope.editPostFormPostId = null;
                            post.postContent = data.content;
                            toaster.pop('error', 'Success!', 'Post edited successfully!', defaultNotificationTimeout);
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                        });
                }
            });
        }
    }]);


