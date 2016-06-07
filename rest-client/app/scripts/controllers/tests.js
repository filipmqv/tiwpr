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

app.controller('TestsCtrl', function ($scope, TestsService, ClassesService, 
	SubjectsService, Session, popupService) {

	var clearVariables = function () {
		$scope.tests = [];
		$scope.classes = [];
		$scope.subjects = [];
		$scope.testTypes = ['short test', 'homework', 'essay'];
	};

	$scope.initController = function () {
		clearVariables();
		getClasses();
		getSubjects();
		getTests();
	};	

	var getClasses = function () {
		ClassesService.get(function (data) {
			$scope.classes = data._items;
		});
	};

	var getSubjects = function () {
		SubjectsService.get(function (data) {
			$scope.subjects = data._items;
		});
	};

	var getTests = function () {
		TestsService.get({teacherId:$scope.currentUser.id}, function (data) {
			$scope.tests = data._items;
			for (var i = 0; i < $scope.tests.length; i++) {
				$scope.tests[i].testdate = new Date($scope.tests[i].testdate);
			}
		});
	};

	$scope.deleteTest = function(test) {
		if (popupService.showPopup('Really delete this?')) {
			Session.putEtag(test._etag);
			TestsService.delete({teacherId:$scope.currentUser.id}, test, function() {
				Session.removeEtag();
				getTests();
			});
		}
	};

	$scope.initController();
});



app.controller('TestAddCtrl', function($scope, $routeParams, $location, $filter, TestsService, ClassesService, 
	SubjectsService) {

	var clearVariables = function () {
		$scope.buttonText = 'Add';
		$scope.error = '';
		$scope.test = new TestsService();
		$scope.classes = [];
		$scope.subjects = [];
		$scope.testStatus = ['zapowiedziany', 'oceniony'];
		$scope.testTypes = ['short test', 'homework', 'essay']; //0-zapowiedziany, 1-oceniony
		$scope.picker = new Date();
	};

	$scope.initController = function () {
		clearVariables();
		getClasses();
		getSubjects();
	};

	var getClasses = function () {
		ClassesService.get(function (data) {
			$scope.classes = data._items;
		});
	};

	var getSubjects = function () {
		SubjectsService.get(function (data) {
			$scope.subjects = data._items;
		});
	};

	var clearUnnecessaryFields = function () {
		delete $scope.test._etag;
		delete $scope.test._created;
		delete $scope.test._updated;
		delete $scope.test._links;
	};

	$scope.addTest = function() { 
		$scope.test.teacher_id = $scope.currentUser.id;
		$scope.test.status = 0;
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');
		clearUnnecessaryFields();

		$scope.test.$save({teacherId:$scope.currentUser.id}, function() {
			$location.path('/tests');
		});
	};	

	$scope.initController();
});



app.controller('TestEditCtrl', function($scope, $routeParams, $location, $filter, TestsService, 
	ClassesService, SubjectsService, Session) {

	var clearVariables = function () {
		$scope.editMode = true;
		$scope.buttonText = 'Save';
		$scope.error = '';
		$scope.test = {};
		$scope.classes = [];
		$scope.subjects = [];
		$scope.testTypes = ['short test', 'homework', 'essay']; //0-zapowiedziany, 1-oceniony
	};

	$scope.initController = function () {
		clearVariables();
		getClasses();
		getSubjects();
		getTest();
	};

	var getClasses = function () {
		ClassesService.get(function (data) {
			$scope.classes = data._items;
		});
	};

	var getSubjects = function () {
		SubjectsService.get(function (data) {
			$scope.subjects = data._items;
		});
	};

	var getTest = function () {
		TestsService.get({testId:$routeParams.id, teacherId:$scope.currentUser.id}, function (data) {
			$scope.test = data;
			$scope.picker = new Date(data.testdate);
			Session.putEtag($scope.test._etag);
		});
	};

	var clearUnnecessaryFields = function () {
		delete $scope.test._etag;
		delete $scope.test._created;
		delete $scope.test._updated;
		delete $scope.test._links;
	};

	$scope.updateTest = function() {
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');
		clearUnnecessaryFields();

		TestsService.update({teacherId:$scope.currentUser.id}, $scope.test, function() {
			Session.removeEtag();
			$location.path('/tests');
		}, function (error) {
			if (error.status === 412) {
				$scope.error = 'You do not update the newest data. Refresh page and try again.';
			}
			else if (error.status === 422) {
				$scope.error = 'Incorrect data';
			}
			console.log(error);
		});
	};

	$scope.initController();
});