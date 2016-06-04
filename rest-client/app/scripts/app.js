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
      .when('/tests/:id/grades', {
        templateUrl: 'views/test-grades.html',
        controller: 'TestGradesCtrl'
      })
      .when('/tests/:id/grades/add', {
        templateUrl: 'views/test-grades-add.html',
        controller: 'TestGradesAddCtrl'
      })
      .when('/tests/:id/grades/edit', {
        templateUrl: 'views/test-grades-edit.html',
        controller: 'TestGradesEditCtrl'
      })

      .when('/lessons', {
        templateUrl: 'views/lessons.html',
        controller: 'LessonsCtrl'
      })
      .when('/lessons/new', {
        templateUrl: 'views/lesson-add.html',
        controller: 'LessonAddCtrl'
      })
      .when('/lessons/:lessonId', {
        templateUrl: 'views/lesson.html',
        controller: 'LessonCtrl'
      })

      .when('/students', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl'
      })
      .when('/students/:id', {
        templateUrl: 'views/student.html',
        controller: 'StudentCtrl'
      })
      .when('/students/:id/grades/new', {
        templateUrl: 'views/grade-add.html',
        controller: 'GradeAddCtrl'
      })
      .when('/students/:id/grades/:gradeId', {
        templateUrl: 'views/grade.html',
        controller: 'GradeCtrl'
      })
      

      .otherwise({
        redirectTo: '/'
      });
      
    localStorageServiceProvider
      .setPrefix('restClientApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

  });
