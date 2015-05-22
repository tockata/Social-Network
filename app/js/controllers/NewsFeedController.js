'use strict';

socialNetworkApp.controller('NewsFeedController',
    ['$scope', 'postData', 'userData', 'commentData', 'credentials', 'toaster', 'defaultProfileImageData', function ($scope, postData, userData, commentData, credentials, toaster, defaultProfileImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;

        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.showAllComments = showAllComments;
        $scope.commentButtonName = 'Comment';
        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;
        $scope.unlikePost = unlikePost;
        $scope.likePost = likePost;
        $scope.deletePost = deletePost;

        if($scope.isLogged) {
            getNewsFeed();
        }

        function getNewsFeed() {
            postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.newsFeed = data;
                }, function (error) {

                });
        }

        function showAllComments(postId) {
            $scope.postAllComments = {
                postId: postId,
                comments: []
            };
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.postAllComments.comments = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }

        function toggleNewCommentForm(postId) {
            if($scope.showNewCommentForm) {
                $scope.showNewCommentForm = false;
                $scope.commentButtonName = 'Comment';
                $scope.commentContent = '';
            } else {
                $scope.showNewCommentForm = true;
                $scope.newCommentFormPostId = postId;
                $scope.commentButtonName = 'Hide';
            }
        }

        function postComment(commentContent, postId) {
            commentData.addComment(commentContent, postId)
                .$promise
                .then(function (data) {
                    toaster.pop('error', 'Success!', 'Comment successfully added.');
                    $scope.showNewCommentForm = false;
                    $scope.newCommentFormPostId = null;
                    getNewsFeed();
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function unlikePost(postId) {
            $scope.newsFeed.forEach(function (post) {
                if(post.id == postId) {
                    if((post.author.isFriend || post.wallOwner.isFriend) && post.author.username !== $scope.user.username) {
                        postData.unlikePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = false;
                                post.likesCount--;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    }
                }
            });
        }

        function likePost(postId) {
            $scope.newsFeed.forEach(function (post) {
                if(post.id == postId) {
                    if((post.author.isFriend || post.wallOwner.isFriend) && post.author.username !== $scope.user.username) {
                        postData.likePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = true;
                                post.likesCount++;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    }
                }
            });
        }

        function deletePost(postId) {
            $scope.newsFeed.forEach(function (post, index, object) {
                if(post.id == postId && post.author.username == $scope.user.username) {
                    postData.deletePost(postId)
                        .$promise
                        .then(function (data) {
                            toaster.pop('error', 'Success!', data.message);
                            object.splice(index, 1);
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message);
                        });
                }
            })
        }
    }]);
