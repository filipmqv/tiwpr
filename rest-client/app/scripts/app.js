'use strict';

/**
 * @ngdoc overview
 * @name restClientApp
 * @description
 * # restClientApp
 *
 * Main module of the application.
 */
angular
  .module('restClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'SchoolServices',
    'base64',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/student', {
        templateUrl: 'views/student.html',
        controller: 'StudentCtrl'
      })
      .when('/teacher', {
        templateUrl: 'views/teacher.html',
        controller: 'TeacherCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    localStorageServiceProvider
      .setPrefix('restClientApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

  });
