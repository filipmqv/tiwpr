'use strict';

var services = angular.module('SchoolServices', ['ngResource']);

var lhost = 'http://localhost:5000/';
//var rhcloud = 'http://server-foodplaner.rhcloud.com/rest/v1/'; // to change
var domainUrl = lhost;

services.factory('LoginService', function ($resource) {
	return $resource(domainUrl + 'login', {}, {
		save: {method: 'POST'},
	});
});

/*services.factory('AuthService',function(localStorageService, UserService, $q) {
  var isLoggedIn;
  var credentials;
  var myId;
  var userInfo;

  function init() {
    if (localStorageService.get('credentials')) {
      isLoggedIn = true;
      credentials = localStorageService.get('credentials');
      myId = localStorageService.get('myId');
      fetchUserInfo();
    }
    else {
      isLoggedIn = false;
      credentials = {};
      myId = {};
      userInfo = {};
    }
  }

  function fetchUserInfo() {
    UserService.get({userId:myId}, function (data) {
      userInfo = data;
      console.log('fetshed');
      console.log(userInfo);
    });
  }

  function setUserInfo(data) {
    isLoggedIn = true;
    localStorageService.set('credentials', data.hash);
    //localStorageService.set('role', data.role);
    localStorageService.set('myId', data.myId);
    //return userInfo;
  }

  function clearUserInfo() {
    localStorageService.clearAll();
    userInfo = {};
    isLoggedIn = false;
  }

  function getUserInfo() {
    return userInfo;
  }

  function getCredentials() {
    return credentials;
  }

  init();

  return {
    getUserInfo: getUserInfo,
    setUserInfo: setUserInfo,
    clearUserInfo: clearUserInfo,
    getCredentials: getCredentials
  };
});*/

services.factory('UserService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'users/:userId');
});

services.factory('ClassesService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'classes');
});

services.factory('SubjectsService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'subjects');
});

services.factory('TeacherService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'users/:teacherId');
});

services.factory('TestsService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'tests/:testId?embedded={:embObj}&where={"teacher_id": ":teacherId"}' , 
    {testId:'@_id'}, {
    update: {
      method: 'PUT',
      headers: {
        'If-Match': 
        function () {
          return localStorageService.get('etag');
        }
      }
    },
    delete: {
      method: 'DELETE', 
      headers: {
        'If-Match': 
        function () {
          return localStorageService.get('etag');
        }
      }
    }
  });
});

services.factory('StudentsService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'students/:studentId?where={:whereObj}&page=:n');
});

services.factory('GradesService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'students/:studentId/grades/:gradeId?embedded={"test_id"::embed}' , 
        {gradeId:'@_id', embed: '1'}, {
    update: {
      method: 'PUT',
      headers: {
        'If-Match': 
        function () {
          return localStorageService.get('etag');
        }
      }
    },
    delete: {
      method: 'DELETE', 
      headers: {
        'If-Match': 
        function () {
          return localStorageService.get('etag');
        }
      }
    }
  });
});

services.factory('GradesCombinedService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'grades?where={:whereObj}' , {}, {
    saveBulk: {
      method: 'POST',
      isArray: false
    }
  });
});

services.factory('LessonsService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'lessons/:lessonId?embedded={:embObj}&'+
    'where={:whereObj}&page=:n' , {lessonId:'@_id'}, {
    });
});

services.factory('AttendancesService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'students/:studentId/attendances/:attId?embedded={:embObj}&'+
    'where={:whereObj}' , {attId:'@_id'}, {
    });
});

services.factory('AttendancesCombinedService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'attendances?embedded={:embObj}&where={:whereObj}' , {}, {
    saveBulk: {
      method: 'POST',
      isArray: false
    }
  });
});

/*services.factory('AttendancesCombinedService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'attendances'), {}, {
    save: {
      method: 'POST',
      isArray: true
    }
  };
});*/



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