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

app.controller('LessonsCtrl', function($scope, LessonsService, paginationService) {

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
			whereObj:'"teacher_id":"'+$scope.currentUser.id+'"'}, function (data) {
				$scope.lessons = data._items;
				$scope.meta = data._meta;
			});
	};

	$scope.range = function() {
		return paginationService.paginationRange($scope.meta.total, $scope.meta.max_results);
	};

	$scope.initController();
});





app.controller('LessonAddCtrl', function($scope, $routeParams, $location, $filter, LessonsService, LessonsIdService, 
	ClassesService, SubjectsService, StudentsService, AttendancesService, AttendancesCombinedService, Session) {

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
		getIdForNewLesson();
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

	var createDummyLesson = function() {
		var dummyLesson = {};
		dummyLesson.lessondate = '1000-01-01T00:00:00'; // dummy date
		dummyLesson.class_id = '5757490100548006550e46d5'; // dummy class
		dummyLesson.teacher_id = '5757495100548006550e46d6'; //dummy teacher
		dummyLesson.subject_id = '57574d1200548006550e46d7'; // dummy subject
		return dummyLesson;
	};

	var getIdForNewLesson = function() {
		LessonsIdService.save({}, createDummyLesson(), function(data) {
			// obtained id and etag
			$scope.lesson._id = data._id;
			Session.putEtag(data._etag);
		}, function(error) {
			$scope.error = 'Error while obtaining id for new lesson '+error.status +' '+ error.statusText;
			console.log(error);
		});
	}

	$scope.addLesson = function() { 
		$scope.lesson.teacher_id = $scope.currentUser.id;
		$scope.lesson.lessondate = $filter('date')($scope.picker, 'yyyy-MM-ddTHH:mm:ss');

		LessonsService.update({}, $scope.lesson, function() {
			Session.removeEtag();
			prepareAttendancesObj($scope.lesson._id);
			AttendancesCombinedService.saveBulk($scope.attendancesObj, function() {
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
