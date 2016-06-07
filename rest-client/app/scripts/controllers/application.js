'use strict';

/**
* @ngdoc function
* @name restClientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location) {

	$scope.currentUser = {};
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};

	var init = function() {
		$scope.currentUser = AuthService.init();
	};

	$scope.logoutClick = function () {
		$scope.setCurrentUser(null);
		AuthService.logout();
		$location.path('/');
	};

	init();

});