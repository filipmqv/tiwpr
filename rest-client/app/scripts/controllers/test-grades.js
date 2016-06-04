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

app.controller('TestGradesCtrl', function ($scope, TestsService, ClassesService, 
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

	$scope.deleteTest = function(test) {
		if (popupService.showPopup('Really delete this?')) {
			localStorageService.set('etag', test._etag);
			TestsService.delete({teacherId:localStorageService.get('myId')}, test, function() {
				getTests();
			});
		}
	};

	$scope.initController();
});



app.controller('TestGradesAddCtrl', function($scope, $routeParams, $location, $filter, TestsService, 
	StudentsService, GradesCombinedService, clearFieldsService, localStorageService) {

	var clearVariables = function () {
		$scope.buttonText = 'Add';
		$scope.error = '';
		$scope.test = {};
		$scope.studentsGrades = [];
		$scope.studentsGradesObj = [];
		$scope.allowedGrades = ['', '1', '1+', '2-', '2', '2+', '3-', '3', '3+', '4-', '4', '4+', '5-', '5', '5+', '6-', '6', '6+'];
	};

	$scope.initController = function () {
		clearVariables();
		getTest();
	};

	var getTest = function () {
		TestsService.get({testId:$routeParams.id, embObj:'"class_id":1, "subject_id":1'}, function (data) {
			$scope.test = data;
			getStudentsFromClass();
		});
	};

	var getStudentsFromClass = function () {
		StudentsService.get({whereObj:'"class_id":"'+$scope.test.class_id._id+'"'}, function (data) {
			var students = data._items;
			for (var i = 0; i < students.length; i++) {
				var o = {};
				o.student_id = students[i]._id;
				o.test_id = $scope.test.class_id._id;
				o.gradevalue = '';

				o.firstname = students[i].firstname;
				o.lastname = students[i].lastname;
				o.registrynumber = students[i].registrynumber;
				$scope.studentsGrades.push(o);
			}
		});
	};

	var prepareStudentsGradesObj = function () {
		for (var i = 0; i < $scope.studentsGrades.length; i++) {
			if ($scope.studentsGrades[i].gradevalue !== '' && $scope.studentsGrades[i].gradevalue !== undefined) {
				var o = {};
				o.student_id = $scope.studentsGrades[i].student_id;
				o.test_id = $scope.test._id;
				o.gradevalue = $scope.studentsGrades[i].gradevalue;
				$scope.studentsGradesObj.push(o);
			}
		}
	};

	$scope.addGrades = function() { 
		// update test - give status 1, 
		$scope.error = '';
		var testObj = $scope.test;
		testObj.status = 1;
		// due to embedded fields:
		testObj.class_id = testObj.class_id._id;
		testObj.subject_id = testObj.subject_id._id;
		localStorageService.set('etag', testObj._etag);
		testObj = clearFieldsService.clear(testObj);

		TestsService.update({teacherId:localStorageService.get('myId')}, testObj, function() {
			localStorageService.remove('etag');
			$scope.test.status = 1;

			// post grades
			prepareStudentsGradesObj();
			GradesCombinedService.saveBulk($scope.studentsGradesObj, function() {
				$location.path('/tests');
			}, function (error) {
				$scope.error = 'Error while creating grades '+error.status +' '+ error.statusText;
				console.log(error);
			});
		}, function (error) {
			$scope.error = 'Error while updating test '+error.status +' '+ error.statusText;
			console.log(error);
		});

		/*$scope.test.teacher_id = localStorageService.get('myId');
		$scope.test.status = 0;
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');
		clearUnnecessaryFields();

		$scope.test.$save({teacherId:localStorageService.get('myId')}, function() {
			$location.path('/tests');
		});*/
	};	

	$scope.initController();
});



app.controller('TestGradesEditCtrl', function($scope, $routeParams, $location, $filter, TestsService, 
	ClassesService, SubjectsService, localStorageService) {

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

	$scope.updateTest = function() {
		$scope.test.testdate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');
		clearUnnecessaryFields();

		TestsService.update({teacherId:localStorageService.get('myId')}, $scope.test, function() {
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