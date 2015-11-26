(function () {
    'use strict'

    // create the controller and inject Angular's $scope
    myApp.controller('retrospectiveController', function ($scope, $location, $routeParams, app_constants, sessionUtils) {
        //$scope.authorized = authorized;
        //console.log($scope.authorized);
        $scope.canRetro = false;
        if (sessionUtils.isSessionIdSet(app_constants.sessionStorageId)) {
            $scope.canRetro = true;
            //$location.path('/home', {authorized: false});
        }
        // create a message to display in our view
        $scope.shortMessage = 'START app!';
    });
})();