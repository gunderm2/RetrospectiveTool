var myApp = angular.module('startapp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

myApp.constant('app_constants', {
    'sessionStorageId': 'sessionId'
});

// configure our routes
myApp.config(function ($routeProvider) {
    'use strict'
    $routeProvider
    // route for the home page
        .when('/home', {
            templateUrl: 'scripts/home/home.html',
            controller: 'homeController'
        })
        // route for the retrospective page
        .when('/retrospective/:sessionId', {
            templateUrl: 'scripts/retrospective/view/retrospective.html',
            controller: 'retrospectiveController'
                //            resolve: {
                //                authorized: function ($q, $location, sessionUtils) {
                //                    sessionUtils.authCheck().then(function success() {
                //                        return true;                        
                //                    }, function error() {
                //                        return false;
                //                        //$location.path('/home', {authorized: false});
                //                    })
                //                }
                //            }
        })
        // route for the about page
        .when('/about', {
            templateUrl: 'scripts/about/about.html',
            controller: 'aboutController'
        })
        // route for the contact page
        .when('/contact', {
            templateUrl: 'scripts/contact/contact.html',
            controller: 'contactController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});

//Known issue: when retro page initializes view data is [] if db does not get updates server returns 304 not modified. 
//this is not an issue when the retrospective is active going.
//TODO: 
//    add unit tests and karma
//    create unit tests
//    minify
//    build gradle and grunt/or gulp process