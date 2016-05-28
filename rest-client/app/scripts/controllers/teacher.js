'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('TeacherCtrl', function ($scope, ClassesService/*, $timeout*/) {

 	var clearVariables = function () {
 		$scope.classes = [];
 		$scope.chosenClass = {};
 	};

 	$scope.initController = function () {
 		clearVariables();
 		queryClasses();
 	};


 	var queryClasses = function () {
 		ClassesService.query(function (data) {
 			$scope.classes = data._items;
 		});
 	};

 	$scope.initController();
 });