'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('UserCtrl', function ($scope, UserService) {

 	var clearVariables = function () {
 		$scope.userJson = {};
 	};

 	$scope.initController = function () {
 		clearVariables();
 		getUserInfo();
 	};


 	var getUserInfo = function () {
 		UserService.get({userId:$scope.currentUser.id}, function (data) {
 			$scope.userJson = data;
 		});
 	};

 	$scope.initController();
 });