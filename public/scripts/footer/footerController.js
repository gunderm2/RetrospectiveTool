(function () {
    'use strict'
    myApp.controller('footerController', function ($scope) {
        'use strict'
        $scope.thisYear = new Date().getFullYear();
    });
})();