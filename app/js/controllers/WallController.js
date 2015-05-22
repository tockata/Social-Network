'use strict';

socialNetworkApp.controller('WallController',
    ['$scope', '$route', '$routeParams', 'userData', 'friendsData', 'postData', 'commentData', 'credentials', 'toaster', 'defaultProfileImageData', 'defaultCoverImageData', function ($scope, $route, $routeParams, userData, friendsData, postData, commentData, credentials, toaster, defaultProfileImageData, defaultCoverImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.wallOwnerUsername = $routeParams.username;

        $scope.submitPost = submitPost;
        $scope.deletePost = deletePost;
        $scope.unlikePost = unlikePost;
        $scope.likePost = likePost;
        $scope.editPostFormShown = false;
        $scope.editPostFormPostId = null;
        $scope.showEditPostForm = showEditPostForm;
        $scope.closeEditPostForm = closeEditPostForm;
        $scope.editPost = editPost;

        $scope.showAllComments = showAllComments;
        $scope.commentButtonName = 'Comment';
        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;
        $scope.unlikeComment = unlikeComment;
        $scope.likeComment = likeComment;



        if(!$routeParams.username) {
            getNewsFeed();
        } else {
            getFriendWall();
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
        }

        function getNewsFeed() {
            postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.friendWall = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function getFriendWall() {
            postData.getFriendWall($routeParams.username, _defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.friendWall = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function submitPost(postContent) {
            var post = {
                postContent: postContent,
                username: $scope.wallOwner
            };

            postData.addPost(post)
                .$promise
                .then(function (data) {
                    $scope.friendWall.unshift(data);
                    $route.reload();
                    toaster.pop('success', 'Post successfully added!', data.message);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }

        function sendFriendRequest(username) {
            friendsData.sendFriendRequest(username)
                .$promise
                .then(function (data) {
                    $scope.userData.hasPendingRequest = true;
                    $scope.buttonName = 'Pending request';
                    $scope.disabledButton = 'disabled';
                    toaster.pop('success', 'Success!', data.message);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function deletePost(postId) {
            $scope.friendWall.forEach(function (post, index, object) {
                if(post.id == postId) {
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

        function showEditPostForm(postId) {
            $scope.editPostFormShown = true;
            $scope.editPostFormPostId = postId;
        }

        function closeEditPostForm(){
            $scope.editPostFormShown = false;
            $scope.editPostFormPostId = null;
        }

        function editPost(postId, postContent) {
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId && $scope.user.username == post.author.username) {
                    postData.editPost(postId, postContent)
                        .$promise
                        .then(function (data) {
                            $scope.editPostFormShown = false;
                            $scope.editPostFormPostId = null;
                            post.postContent = data.content;
                            toaster.pop('error', 'Success!', data.message);
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message);
                        });
                }
            });
        }

        function unlikePost(postId) {
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend) {
                        postData.unlikePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = false;
                                post.likesCount--;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t unlike this post!');
                    }
                }
            });
        }

        function likePost(postId) {
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend) {
                        postData.likePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = true;
                                post.likesCount++;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t like this post!');
                    }
                }
            });
        }

        function showAllComments(postId) {
            $scope.postAllComments = {
                postId: postId
            };
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.friendWall.forEach(function (post) {
                        if(post.id == postId) {
                            post.comments = data;
                        }
                    });
                    //$scope.postAllComments.comments = data;
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
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend) {
                        commentData.addComment(commentContent, postId)
                            .$promise
                            .then(function (data) {
                                $scope.showNewCommentForm = false;
                                $scope.newCommentFormPostId = null;
                                post.comments.unshift(data);
                                post.totalCommentsCount++;
                                toaster.pop('error', 'Success!', 'Comment successfully added.');
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop(
                            'error',
                            'Error!',
                            'You can`t comment on posts when neither the author, nor wall owner is a friend.');
                    }
                }
            });
        }

        function unlikeComment(postId, commentId) {
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend) {
                                commentData.unlikeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = false;
                                        comment.likesCount--;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t unlike this comment!');
                            }
                        }
                    });
                }
            });
        }

        function likeComment(postId, commentId) {
            $scope.friendWall.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend) {
                                commentData.likeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = true;
                                        comment.likesCount++;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t like this comment!');
                            }
                        }
                    });
                }
            });
        }
    }]);

