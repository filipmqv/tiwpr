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
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');//AuthService.getCredentials().then(function(data){return data});
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
	return $resource(domainUrl + 'tests/:testId?where={"teacher_id": ":teacherId"}' , {testId:'@_id'}, {
    get: {
      method: 'GET',
    },
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
  return $resource(domainUrl + 'students/:studentId?page=:n');
});

services.factory('GradesService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  return $resource(domainUrl + 'students/:studentId/grades/:gradeId?embedded={"test_id"::embed}' , {gradeId:'@_id', embed: '1'}, {
    get: {
      method: 'GET'
    },
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




services.service('popupService',function($window) {
    this.showPopup=function(message) {
        return $window.confirm(message);
    };
});