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
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    teacher: 'teacher',
    student: 'student',
    parent: 'parent',
    guest: 'guest'
  })
  .config(function ($routeProvider, localStorageServiceProvider, USER_ROLES) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })

      .when('/tests', {
        templateUrl: 'views/tests.html',
        controller: 'TestsCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.teacher]
        }
      })
      .when('/tests/new', {
        templateUrl: 'views/test-add.html',
        controller: 'TestAddCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/tests/:id/edit', {
        templateUrl: 'views/test-edit.html',
        controller: 'TestEditCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/tests/:id/grades', {
        templateUrl: 'views/test-grades.html',
        controller: 'TestGradesCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/tests/:id/grades/add', {
        templateUrl: 'views/test-grades-add.html',
        controller: 'TestGradesAddCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })

      .when('/lessons', {
        templateUrl: 'views/lessons.html',
        controller: 'LessonsCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/lessons/new', {
        templateUrl: 'views/lesson-add.html',
        controller: 'LessonAddCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/lessons/:lessonId', {
        templateUrl: 'views/lesson.html',
        controller: 'LessonCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })

      .when('/students', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/students/:id', {
        templateUrl: 'views/student.html',
        controller: 'StudentCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      .when('/students/:id/grades/new', {
        templateUrl: 'views/grade-add.html',
        controller: 'GradeAddCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/students/:id/grades/new/:optionalTestId', {
        templateUrl: 'views/grade-add.html',
        controller: 'GradeAddCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher]
        }
      })
      .when('/students/:id/grades/:gradeId', {
        templateUrl: 'views/grade.html',
        controller: 'GradeCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      .when('/students/:id/attendances/:attendanceId', {
        templateUrl: 'views/justification.html',
        controller: 'JustificationCtrl',
        data: {
          authorizedRoles: [USER_ROLES.teacher, USER_ROLES.parent]
        }
      })
      

      .otherwise({
        redirectTo: '/'
      });
      
    localStorageServiceProvider
      .setPrefix('restClientApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

  })
  .run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
      var authorizedRoles = next.data.authorizedRoles;
      if (authorizedRoles.indexOf('*') === -1 && !AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  });
