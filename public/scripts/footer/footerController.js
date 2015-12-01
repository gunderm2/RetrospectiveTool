(function () {
    "use strict";
    angular.module('startapp').controller('footerController', function ($scope) {
        'use strict'
        $scope.thisYear = new Date().getFullYear();
    });
})();