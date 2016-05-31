'use strict';

/**
* @ngdoc function
* @name restClientApp.controller=TestsCtrl
* @description
* # TestsCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('TestsCtrl', function ($scope, $window, TestsService, ClassesService, 
	SubjectsService, localStorageService, popupService) {

	var clearVariables = function () {
		$scope.tests = [];
		$scope.classes = [];
		$scope.subjects = [];
		$scope.testStatus = ['zapowiedziany', 'oceniony'];
		$scope.testTypes = ['short test', 'homework', 'essay'];
		//0-zapowiedziany, 1-oceniony
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
		TestsService.get({teacherId:localStorageService.get('myId')}, function (data) {
			$scope.tests = data._items;
			for (var i = 0; i < $scope.tests.length; i++) {
				$scope.tests[i].testdate = new Date($scope.tests[i].testdate);
			}
		});
	};

	$scope.deleteTest = function(test) { // Delete a movie. Issues a DELETE to /api/movies/:id
		console.log(test);
		if (popupService.showPopup('Really delete this?')) {
			localStorageService.set('etag', test._etag);
			TestsService.delete({teacherId:localStorageService.get('myId'), testId: test._id}, test, function() {
				getTests();
			});
		}
	};

	$scope.initController();
});



app.controller('TestAddCtrl', function($scope, $routeParams, $location, $filter, TestsService, ClassesService, SubjectsService, localStorageService/*, $state, $/*, Movie*/) {

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
		console.log($scope.test);
		$scope.test.teacher_id = localStorageService.get('myId');
		$scope.test.status = 0;
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-dd HH:mm:ss');
		clearUnnecessaryFields();

		$scope.test.$save({teacherId:localStorageService.get('myId'), testId: $scope.test._id}, function() {
			$location.path('/tests');
		});
	};	

	$scope.updateTest = function() { //Update the edited movie. Issues a PUT to /api/movies/=id
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-dd HH:mm:ss');
		clearUnnecessaryFields();

		TestsService.update({teacherId:localStorageService.get('myId'), testId: $scope.test._id}, $scope.test, function(data) {
			console.log(data);
			localStorageService.remove('etag');
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



app.controller('TestEditCtrl', function($scope, $routeParams, $location, $filter, TestsService, ClassesService, SubjectsService, localStorageService/*, $state, $/*, Movie*/) {

	var clearVariables = function () {
		$scope.buttonText = 'Save';
		$scope.error = '';
		$scope.test = {};
		$scope.classes = [];
		$scope.subjects = [];
		$scope.testStatus = ['zapowiedziany', 'oceniony'];
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
		TestsService.get({testId:$routeParams.id, teacherId:localStorageService.get('myId')}, function (data) {
			$scope.test = data;
			$scope.picker = new Date(data.testdate);
			localStorageService.set('etag', $scope.test._etag);
		});
	};

	var clearUnnecessaryFields = function () {
		delete $scope.test._etag;
		delete $scope.test._created;
		delete $scope.test._updated;
		delete $scope.test._links;
	};

	$scope.updateTest = function() { //Update the edited movie. Issues a PUT to /api/movies/=id
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-dd HH:mm:ss');
		clearUnnecessaryFields();

		TestsService.update({teacherId:localStorageService.get('myId'), testId: $scope.test._id}, $scope.test, function(data) {
			console.log(data);
			localStorageService.remove('etag');
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