'use strict';
/*jshint camelcase: false */

/**
 * @ngdoc function
 * @name restClientApp.controller:JustificationCtrl
 * @description
 * # JustificationCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('JustificationCtrl', function ($scope, $routeParams, StudentsService, ClassesService, 
 	SubjectsService, AttendancesService, Session, $location) {

 	var clearVariables = function () {
 		$scope.student = {};
 		$scope.subjects = [];
 		$scope.classes = [];
 		$scope.attendance = {};
 	};

 	$scope.initController = function () {
 		clearVariables();
 		getClasses();
 		getSubjects();
 		getStudent();
 		getAttendance();
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

 	var getAttendance = function () {
 		AttendancesService.get({studentId:$routeParams.id, attId: $routeParams.attendanceId, 
 			embObj:'"lesson_id":1'}, function (data) {
 			$scope.attendance = data;
 		});
 	};

 	$scope.updateAttendance = function() {
 		$scope.error = '';
 		var attendanceObj = {};
 		attendanceObj._id = $scope.attendance._id;
 		attendanceObj.student_id = $scope.student._id;
 		attendanceObj.lesson_id = $scope.attendance.lesson_id._id;
 		attendanceObj.status = 'justified'
 		attendanceObj.justification = $scope.attendance.justification;
 		Session.putEtag($scope.attendance._etag);
 		AttendancesService.update({studentId:$routeParams.id}, attendanceObj, function () {
 			Session.removeEtag();
			$location.path('/students/'+$routeParams.id);
 		}, function(error) {
			$scope.error = 'Error while updating test '+error.status +' '+ error.statusText;
            console.log(error);
 		});
 	};
 	
 	$scope.initController();
 });