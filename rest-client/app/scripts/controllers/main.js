'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('MainCtrl', function ($scope, ClassesService/*, $timeout*/) {

 	var clearVariables = function () {
 		$scope.classes = [];
 		$scope.op = {};
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