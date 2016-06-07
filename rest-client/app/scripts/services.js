'use strict';

var services = angular.module('SchoolServices', ['ngResource']);

var lhost = 'http://localhost:5000/';
//var rhcloud = 'http://server-foodplaner.rhcloud.com/rest/v1/'; // to change
var domainUrl = lhost;

services.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
});

services.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
});

services.factory('AuthService', function ($http, Session, localStorageService) {
  var authService = {};

  authService.login = function (credentials) {
    return $http
    .post(domainUrl + 'login', credentials)
    .then(function (res) {
      Session.create(res.data.id, res.data.firstname, res.data.auth, res.data.role);
      $http.defaults.headers.common.Authorization = res.data.auth;
      localStorageService.set('id', res.data.id);
      localStorageService.set('firstname', res.data.firstname);
      localStorageService.set('auth', res.data.auth);
      localStorageService.set('role', res.data.role);
      return res.data;
    });
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  authService.logout = function () {
    $http.defaults.headers.common.Authorization = 'Basic ';
    localStorageService.clearAll();
    Session.destroy();
  };

  authService.init = function () {
    if (localStorageService.get('auth')) {
      var user = {};
      user.id = localStorageService.get('id');
      user.firstname = localStorageService.get('firstname');
      user.auth = localStorageService.get('auth');
      user.role = localStorageService.get('role');
      Session.create(user.id, user.firstname, user.auth, user.role);
      $http.defaults.headers.common.Authorization = user.auth;
      //$scope.setCurrentUser(user);
      return user;
    } else {
      console.log('init - no auth')
      return null;
    }
  }

  return authService;
});

services.service('Session', function () {
  this.putEtag = function (etag) {
    this.etag = etag;
  }
  this.removeEtag = function () {
    this.etag = null;
  }
  this.create = function (userId, userFirstname, userAuth, userRole) {
    this.userId = userId;
    this.userFirstname = userFirstname;
    this.userAuth = userAuth;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.userId = null;
    this.userFirstname = null;
    this.userAuth = null;
    this.userRole = null;
  };
});



services.factory('UserService', function ($resource) {
  return $resource(domainUrl + 'users/:userId');
});

services.factory('ClassesService', function ($resource) {
  return $resource(domainUrl + 'classes');
});

services.factory('SubjectsService', function ($resource) {
  return $resource(domainUrl + 'subjects');
});

services.factory('TeacherService', function ($resource) {
  return $resource(domainUrl + 'users/:teacherId');
});

services.factory('TestsService', function ($resource, Session) {
  return $resource(domainUrl + 'tests/:testId?embedded={:embObj}&where={"teacher_id": ":teacherId"}' , 
    {testId:'@_id'}, {
      update: {
        method: 'PUT',
        headers: {
          'If-Match': 
          function () {
            return Session.etag;
          }
        }
      },
      delete: {
        method: 'DELETE', 
        headers: {
          'If-Match': 
          function () {
            return Session.etag;
          }
        }
      }
    });
});

services.factory('StudentsService', function ($resource) {
  return $resource(domainUrl + 'students/:studentId?where={:whereObj}&page=:n');
});

services.factory('GradesService', function ($resource, Session) {
  return $resource(domainUrl + 'students/:studentId/grades/:gradeId?embedded={"test_id"::embed}' , 
    {gradeId:'@_id', embed: '1'}, {
      update: {
        method: 'PUT',
        headers: {
          'If-Match': 
          function () {
            return Session.etag;
          }
        }
      },
      delete: {
        method: 'DELETE', 
        headers: {
          'If-Match': 
          function () {
            return Session.etag;
          }
        }
      }
    });
});

services.factory('GradesCombinedService', function ($resource) {
  return $resource(domainUrl + 'grades?where={:whereObj}' , {}, {
    saveBulk: {
      method: 'POST',
      isArray: false
    }
  });
});

services.factory('LessonsService', function ($resource) {
  return $resource(domainUrl + 'lessons/:lessonId?embedded={:embObj}&'+
    'where={:whereObj}&page=:n' , {lessonId:'@_id'}, {
    });
});

services.factory('AttendancesService', function ($resource) {
  return $resource(domainUrl + 'students/:studentId/attendances/:attId?embedded={:embObj}&'+
    'where={:whereObj}' , {attId:'@_id'}, {
    });
});

services.factory('AttendancesCombinedService', function ($resource) {
  return $resource(domainUrl + 'attendances?embedded={:embObj}&where={:whereObj}' , {}, {
    saveBulk: {
      method: 'POST',
      isArray: false
    }
  });
});



services.service('popupService',function($window) {
  this.showPopup = function(message) {
    return $window.confirm(message);
  };
});

services.service('paginationService', function() {
  this.paginationRange = function(total, perPage) {
    var input = [];
    for (var i = 1; i <= Math.ceil(total / perPage); i++) {
      input.push(i);
    }
    return input;
  };
  this.maxPage = function(total, perPage) {
    return Math.ceil(total / perPage);
  };
});

services.service('clearFieldsService',function() {
  this.clear = function(obj) {
    delete obj._etag;
    delete obj._created;
    delete obj._updated;
    delete obj._links;
    return obj;
  };
});