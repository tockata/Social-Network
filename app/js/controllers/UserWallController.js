'use strict';

socialNetworkApp.controller('UserWallController',
    ['$scope', '$route', '$routeParams', 'userData', 'friendsData', 'postData', 'commentData', 'credentials', 'toaster', 'defaultProfileImageData', 'defaultCoverImageData', function ($scope, $route, $routeParams, userData, friendsData, postData, commentData, credentials, toaster, defaultProfileImageData, defaultCoverImageData) {
        var defaultStartPostId = 0,
            defaultPageSize = 5,
            defaultNotificationTimeout = 2000;
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.wallOwnerUsername = $routeParams.username;

        $scope.submitPost = submitPost;
        $scope.deletePost = deletePost;
        $scope.unlikePost = unlikePost;
        $scope.likePost = likePost;

        $scope.allCommentsShown = false;
        $scope.showAllComments = showAllComments;
        $scope.showLessComments = showLessComments;
        $scope.commentButtonName = 'Comment';
        $scope.unlikeComment = unlikeComment;
        $scope.likeComment = likeComment;
        $scope.deleteComment = deleteComment;

        $scope.userPreviewShown = false;
        $scope.showUserPreview = showUserPreview;

        getPosts();
        if($routeParams.username) {
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
                });
        }

        function getPosts() {
            if(!$routeParams.username) {
                postData.getNewsFeed(defaultStartPostId, defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                    });
            } else {
                postData.getUserWall($routeParams.username, defaultStartPostId, defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.status);
                    });
            }
        }

        function submitPost(postContent) {
            var post = {
                postContent: postContent,
                username: $scope.wallOwner
            };

            postData.addPost(post)
                .$promise
                .then(function (data) {
                    $scope.posts.unshift(data);
                    toaster.pop('success', 'Post successfully added!', data.message, defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                })
        }

        function deletePost(postId) {
            $scope.posts.forEach(function (post, index, object) {
                if(post.id == postId) {
                    postData.deletePost(postId)
                        .$promise
                        .then(function (data) {
                            toaster.pop('success', 'Success!', 'Post deleted successfully.', defaultNotificationTimeout);
                            object.splice(index, 1);
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                        });
                }
            })
        }

        function unlikePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.unlikePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = false;
                                post.likesCount--;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t unlike this post!', defaultNotificationTimeout);
                    }
                }
            });
        }

        function likePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.likePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = true;
                                post.likesCount++;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t like this post!', defaultNotificationTimeout);
                    }
                }
            });
        }

        function showAllComments(postId) {
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.posts.forEach(function (post) {
                        if(post.id == postId) {
                            post.comments = data;
                            $scope.allCommentsShown = true;
                        }
                    });
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                })
        }

        function showLessComments(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments = post.comments.slice(0, 3);
                    $scope.allCommentsShown = false;
                }
            });
        }

        function unlikeComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                commentData.unlikeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = false;
                                        comment.likesCount--;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t unlike this comment!', defaultNotificationTimeout);
                            }
                        }
                    });
                }
            });
        }

        function likeComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                commentData.likeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = true;
                                        comment.likesCount++;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t like this comment!', defaultNotificationTimeout);
                            }
                        }
                    });
                }
            });
        }

        function deleteComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment, index, object) {
                        if(comment.id == commentId) {
                            if ($scope.user.username == comment.author.username || $scope.user.username == post.author.username) {
                                commentData.deleteComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        post.totalCommentsCount--;
                                        toaster.pop('error', 'Success!', 'Comment deleted successfully.', defaultNotificationTimeout);
                                        object.splice(index, 1);
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                                    });
                            }
                        }
                    });
                }
            })
        }

        function sendFriendRequest(username, userType) {
            if(userType == 'wallOwner') {
                friendsData.sendFriendRequest(username)
                    .$promise
                    .then(function (data) {
                        $scope.userData.hasPendingRequest = true;
                        $scope.buttonName = 'Pending request';
                        $scope.disabledButton = 'disabled';
                        toaster.pop('success', 'Success!', data.message, defaultNotificationTimeout);
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                    });
            } else if(userType == 'postAuthor' || userType == 'commentAuthor') {
                friendsData.sendFriendRequest(username)
                    .$promise
                    .then(function (data) {
                        $scope.userFriendStatus = 'Pending';
                        $scope.userHoverButtonType = 'disabled';

                        if(username.toLowerCase() == $scope.wallOwnerUsername.toLowerCase()) {
                            $scope.buttonName = 'Pending request';
                            $scope.disabledButton = 'disabled';
                        }

                        toaster.pop('success', 'Success!', data.message, defaultNotificationTimeout);
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                    });
            }
        }

        function showUserPreview(username) {
            $scope.userFriendStatus = 'Getting status...';
            $scope.userHoverButtonType = 'disabled';

            userData.getUserPreviewData(username)
                .$promise
                .then(function (data) {
                    if(data.username == $scope.user.username) {
                        $scope.userFriendStatus = 'Me';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(data.isFriend) {
                        $scope.userFriendStatus = 'Friend';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Pending';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && !data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Invite';
                        $scope.userHoverButtonType = 'enabled';
                    }
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });

            return true;
        }
    }]);

