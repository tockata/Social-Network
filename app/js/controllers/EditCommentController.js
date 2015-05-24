'use strict';

socialNetworkApp.controller('EditCommentController',
    ['$scope', 'commentData', 'toaster', function ($scope, commentData, toaster) {
        var defaultNotificationTimeout = 2000;
        $scope.editCommentFormShown = false;
        $scope.editCommentFormCommentId = null;
        $scope.showEditCommentForm = showEditCommentForm;
        $scope.closeEditCommentForm = closeEditCommentForm;
        $scope.editComment = editComment;

        function showEditCommentForm(commentId) {
            $scope.editCommentFormShown = true;
            $scope.editCommentFormCommentId = commentId;
        }

        function closeEditCommentForm(){
            $scope.editCommentFormShown = false;
            $scope.editCommentFormCommentId = null;
        }

        function editComment(postId, commentId, commentContent) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId && $scope.user.username == comment.author.username) {
                            commentData.editComment(commentContent, postId, commentId)
                                .$promise
                                .then(function (data) {
                                    $scope.editCommentFormShown = false;
                                    $scope.editCommentFormCommentId = null;
                                    comment.commentContent = data.commentContent;
                                    toaster.pop('error', 'Success!', 'Comment edited successfully!', defaultNotificationTimeout);
                                }, function (error) {
                                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                                });
                        }
                    })
                }
            });
        }
    }]);




