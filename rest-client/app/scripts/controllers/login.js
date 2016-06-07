'use strict';

/**
* @ngdoc function
* @name restClientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $location) {

	$scope.credentials = {
		email: 'teacher1@wp.pl',
		password: 'password'
	};

	$scope.login = function (credentials) {
		AuthService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$scope.setCurrentUser(user);
			$location.path('/');
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};
});