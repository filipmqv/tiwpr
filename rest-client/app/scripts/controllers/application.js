'use strict';
/*jshint camelcase: false */

/**
* @ngdoc function
* @name restClientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location, ChildrenService, Session) {

	$scope.currentUser = {};
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
		if ($scope.currentUser && $scope.currentUser.role === $scope.userRoles.parent) {
			getChildren();
		}
	};

	var init = function() {
		$scope.currentUser = AuthService.init();
		if ($scope.currentUser && $scope.currentUser.role === $scope.userRoles.parent) {
			getChildren();
		}
	};

	$scope.logoutClick = function () {
		$scope.setCurrentUser(null);
		AuthService.logout();
		$location.path('/');
	};

	// parent menu
	var getChildren = function() {
		$scope.children = [];
		ChildrenService.get({userId: Session.userId}, function(data){
			$scope.children = data.children_id;
		});
	};

	init();

});