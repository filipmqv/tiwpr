'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('TeacherCtrl', function ($scope, TeacherService) {

 	var clearVariables = function () {
 		$scope.teacher = {};
 	};

 	$scope.initController = function () {
 		clearVariables();
 		getTeacherInfo();
 	};


 	var getTeacherInfo = function () {
 		TeacherService.get({teacherId:$scope.currentUser.id}, function (data) {
 			$scope.teacher = data;
 		});
 	};

 	$scope.initController();
 });