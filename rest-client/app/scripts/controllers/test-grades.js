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

app.controller('TestGradesCtrl', function ($scope, $routeParams, TestsService, StudentsService, 
		GradesCombinedService /*localStorageService, popupService*/) {

	var clearVariables = function () {
		$scope.test = {};
		$scope.studentsGrades = [];
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
			for (var i in students) {
				var o = {};
				o.student_id = students[i]._id;
				o.firstname = students[i].firstname;
				o.lastname = students[i].lastname;
				o.registrynumber = students[i].registrynumber;
				$scope.studentsGrades.push(o);
			}
			getGradesFromTest();
		});
	};

	var getGradesFromTest = function () {
		GradesCombinedService.get({whereObj:'"test_id":"'+$scope.test._id+'"'}, function (data) {
			var grades = data._items;
			for (var i in $scope.studentsGrades) {
				for (var x in grades) {
					if ($scope.studentsGrades[i].student_id === grades[x].student_id) {
						$scope.studentsGrades[i].gradevalue = grades[x].gradevalue;
						$scope.studentsGrades[i].grade_id = grades[x]._id;
					}
				}
			}
		});
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
			for (var i in students) {
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
		for (var i in $scope.studentsGrades) {
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
				$location.path('/tests/'+$routeParams.id+'/grades');
			}, function (error) {
				$scope.error = 'Error while creating grades '+error.status +' '+ error.statusText;
				console.log(error);
			});
		}, function (error) {
			$scope.error = 'Error while updating test '+error.status +' '+ error.statusText;
			console.log(error);
		});
	};	

	$scope.initController();
});




/*

TODO ###################

app.controller('TestGradesEditCtrl', function($scope, $routeParams, $location, $filter, TestsService, 
	ClassesService, SubjectsService, localStorageService) {

	
});*/