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

services.factory('TestsService', function ($resource, $http, /*$cacheFactory,*/ localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
	return $resource(domainUrl + 'tests/:testId?where={"teacher_id": ":teacherId"}' , {/*testId:'@_id'*/}, {
    get: {
      method: 'GET',
      cache: false
    },
		update: {
      method: 'PUT',
      cache: false,
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