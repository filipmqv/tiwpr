'use strict';
/*jshint camelcase: false */

/**
* @ngdoc function
* @name restClientApp.controller=LessonsCtrl
* @description
* # LessonsCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('LessonsCtrl', function($scope, LessonsService, localStorageService, paginationService) {

	var clearVariables = function() {
		$scope.lessons = [];
		$scope.meta = {};
		$scope.dates = [];
	};

	$scope.initController = function() {
		clearVariables();
		$scope.getLessons(1);
	};	

	$scope.getLessons = function (n) {
		LessonsService.get({embObj:'"class_id":1, "subject_id":1, "teacher_id":1', n:n, 
			whereObj:'"teacher_id":"'+localStorageService.get('myId')+'"'}, function (data) {
				$scope.lessons = data._items;
				$scope.meta = data._meta;
			});
	};

	$scope.range = function() {
		return paginationService.paginationRange($scope.meta.total, $scope.meta.max_results);
	};

	$scope.initController();
});





app.controller('LessonAddCtrl', function($scope, $routeParams, $location, $filter, LessonsService, ClassesService, 
	SubjectsService, StudentsService, AttendancesService, AttendancesCombinedService, localStorageService) {

	var clearVariables = function () {
		$scope.error = '';
		$scope.lesson = new LessonsService();
		$scope.classes = [];
		$scope.subjects = [];
		$scope.students = [];
		$scope.picker = new Date();
		$scope.attendances = [];
		$scope.attendancesObj = [];
		$scope.allowedAtt = ['absent', 'present'];
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

	$scope.getStudentsFromClass = function () {
		StudentsService.get({whereObj:'"class_id":"'+$scope.lesson.class_id+'"'}, function (data) {
			$scope.students = data._items;
			$scope.attendances = [];
			for (var i = 0; i < $scope.students.length; i++) {
				var o = {};
				o.student_id = $scope.students[i]._id;
				o.firstname = $scope.students[i].firstname;
				o.lastname = $scope.students[i].lastname;
				o.registrynumber = $scope.students[i].registrynumber;
				o.status = 'present';
				$scope.attendances.push(o);
			}
		});
	};

	var prepareAttendancesObj = function (lessonId) {
		for (var i = 0; i < $scope.attendances.length; i++) {
			var o = {};
			o.lesson_id = lessonId;
			o.student_id = $scope.attendances[i].student_id;
			o.status = $scope.attendances[i].status;
			$scope.attendancesObj.push(o);
		}
	};

	$scope.addLesson = function() { 
		$scope.lesson.teacher_id = localStorageService.get('myId');
		$scope.lesson.lessondate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');
		
		$scope.lesson.$save({teacherId:localStorageService.get('myId')}, function(data) {
			prepareAttendancesObj(data._id);
			AttendancesCombinedService.save($scope.attendancesObj, function() {
				$location.path('/lessons');
			}, function (error) {
				$scope.error = 'Error while creating attendances '+error.status +' '+ error.statusText;
				console.log(error);
			});
		}, function (error) {
			$scope.error = 'Error while creating lesson '+error.status +' '+ error.statusText;
			console.log(error);
		});
	};	

	$scope.initController();
});





app.controller('LessonCtrl', function($scope, $routeParams, LessonsService, AttendancesCombinedService) {

	var clearVariables = function () {
		$scope.lesson = {};
		$scope.attendances = [];
	};

	$scope.initController = function () {
		clearVariables();
		getLesson();
		getAttendances();
	};

	var getLesson = function () {
		LessonsService.get({embObj:'"class_id":1, "subject_id":1, "teacher_id":1', 
			lessonId:$routeParams.lessonId}, function (data) {
				$scope.lesson = data;
			});
	};

	var getAttendances = function () {
		AttendancesCombinedService.get({embObj:'"student_id":1', 
			whereObj:'"lesson_id":"'+$routeParams.lessonId+'"'}, function (data) {
				$scope.attendances = data._items;
			});
	};

	$scope.initController();
});
