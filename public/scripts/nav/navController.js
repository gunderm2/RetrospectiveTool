(function () {
    "use strict";

    angular.module('startapp').controller('navController', function ($scope, $rootScope, $location, app_constants, sessionUtils) {
        'use strict'
        $scope.canRetropect = sessionUtils.isSessionIdSet(app_constants.sessionStorageId);
        //console.log('navController canRetrospect :', $scope.canRetropect);
        $rootScope.$on('canRetrospect', function (event, mass) {
            console.log('mass :', mass);
            $scope.canRetropect = mass;
        });

        $scope.goHome = function () {
            $location.path('/home');
        };

        $scope.goAbout = function () {
            $location.path('/about');
        };

        $scope.goContact = function () {
            $location.path('/contact');
        };

        $scope.goRetrospect = function () {
            if (sessionUtils.isSessionIdSet(app_constants.sessionStorageId)) {
                $location.path('/retrospective/' + sessionUtils.getSessionAttribute(app_constants.sessionStorageId).sessionId);
            }
        };
    });
})();