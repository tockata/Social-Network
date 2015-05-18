'use strict';

socialNetworkApp.directive('friendRequests', function () {
    return {
        templateUrl: 'partials/directives/friends-requests.html',
        restrict: 'A',
        controller: 'FriendRequestsController'
    }
});
