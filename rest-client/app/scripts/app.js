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

      .when('/tests', {
        templateUrl: 'views/tests.html',
        controller: 'TestsCtrl'
      })
      .when('/tests/new', {
        templateUrl: 'views/test-add.html',
        controller: 'TestAddCtrl'
      })
      .when('/tests/:id/edit', {
        templateUrl: 'views/test-edit.html',
        controller: 'TestEditCtrl'
      })
      
      .otherwise({
        redirectTo: '/'
      });
      /*

      $stateProvider.state('movies', { // state for showing all movies
    url: '/movies',
    templateUrl: 'partials/movies.html',
    controller: 'MovieListController'
  }).state('viewMovie', { //state for showing single movie
    url: '/movies/:id/view',
    templateUrl: 'partials/movie-view.html',
    controller: 'MovieViewController'
  }).state('newMovie', { //state for adding a new movie
    url: '/movies/new',
    templateUrl: 'partials/movie-add.html',
    controller: 'MovieCreateController'
  }).state('editMovie', { //state for updating a movie
    url: '/movies/:id/edit',
    templateUrl: 'partials/movie-edit.html',
    controller: 'MovieEditController'
    */
    localStorageServiceProvider
      .setPrefix('restClientApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

  });
