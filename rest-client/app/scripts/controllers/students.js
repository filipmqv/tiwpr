'use strict';
/*jshint camelcase: false */

/**
* @ngdoc function
* @name restClientApp.controller=TestsCtrl
* @description
* # TestsCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('StudentsCtrl', function($scope, $window, ClassesService, StudentsService, paginationService) {

	var clearVariables = function() {
		$scope.classes = [];
		$scope.students = [];
		$scope.meta = {};
	};

	$scope.initController = function() {
		clearVariables();
		getClasses();
		$scope.getStudents(1);

	};	

	var getClasses = function() {
		ClassesService.get(function (data) {
			$scope.classes = data._items;
		});
	};

	$scope.getStudents = function(n) {
		StudentsService.get({n: n}, function (data) {
			$scope.students = data._items;
			$scope.meta = data._meta;
		});
	};

	$scope.range = function() {
		return paginationService.paginationRange($scope.meta.total, $scope.meta.max_results);
	};
	
	$scope.initController();
});