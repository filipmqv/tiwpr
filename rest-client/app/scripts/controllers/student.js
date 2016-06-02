'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:StudentCtrl
 * @description
 * # StudentCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('StudentCtrl', function ($scope, $routeParams, StudentsService, ClassesService, 
 	SubjectsService, GradesService) {

 	var clearVariables = function () {
 		$scope.student = {};
 		$scope.grades = [];
 		$scope.subjects = [];
 		$scope.classes = [];
 	};

 	$scope.initController = function () {
 		clearVariables();
 		getClasses();
 		getSubjects();
 		getStudent();
 		getGrades();
 	};

 	var getClasses = function () {
 		ClassesService.get(function (data) {
 			$scope.classes = data._items;
 		});
 	};

 	var getStudent = function () {
		StudentsService.get({studentId:$routeParams.id}, function (data) {
			$scope.student = data;
		});
	};

	var getSubjects = function () {
		SubjectsService.get(function (data) {
			$scope.subjects = data._items;
		});
	};

	var getGrades = function () {
		GradesService.get({studentId:$routeParams.id}, function (data) {
			$scope.grades = data._items;
		});
	};
	
 	$scope.initController();
 });