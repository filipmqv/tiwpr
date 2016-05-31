'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('TeacherCtrl', function ($scope, TeacherService, localStorageService) {

 	var clearVariables = function () {
 		$scope.teacher = {};
 	};

 	$scope.initController = function () {
 		clearVariables();
 		getTeacherInfo();
 	};


 	var getTeacherInfo = function () {
 		TeacherService.get({teacherId:localStorageService.get('myId')}, function (data) {
 			$scope.teacher = data;
 		});
 	};

 	$scope.initController();
 });