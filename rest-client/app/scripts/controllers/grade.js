'use strict';
/*jshint camelcase: false */

/**
* @ngdoc function
* @name restClientApp.controller:GradeCtrl
* @description
* # GradeCtrl
* Controller of the restClientApp
*/
var app = angular.module('restClientApp');

app.controller('GradeCtrl', function ($scope, $location, $routeParams, StudentsService, ClassesService, 
    SubjectsService, GradesService, UserService, localStorageService, popupService, clearFieldsService) {

    var clearVariables = function () {
        $scope.gradevalue = '';
        $scope.editMode = false;
        $scope.student = {};
        $scope.teacher = {};
        $scope.grade = {};
        $scope.test = {};
        $scope.subjects = [];
        $scope.classes = [];
        $scope.allowedGrades = ['1', '1+', '2-', '2', '2+', '3-', '3', '3+', '4-', '4', '4+', '5-', '5', '5+', '6-', '6', '6+'];
    };

    $scope.initController = function () {
        clearVariables();
        getClasses();
        getSubjects();
        getStudent();
        getGrade();
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

    var getGrade = function () {
        GradesService.get({studentId:$routeParams.id, gradeId:$routeParams.gradeId}, function (data) {
            $scope.grade = data;
            $scope.test = data.test_id;
            $scope.grade.test_id = $scope.test._id;
            getTeacher();
        });
    };

    var getTeacher = function () {
        UserService.get({userId:$scope.test.teacher_id}, function (data) {
            $scope.teacher = data;
        });
    };

    $scope.switchToEditMode = function () {
        localStorageService.set('etag', $scope.grade._etag);
        $scope.gradeOption = $scope.grade.gradevalue;
        $scope.editMode = true;
    };

    $scope.switchToNormalMode = function () {
        $scope.editMode = false;
    };

    $scope.updateGrade = function() {
        var tempGrade = $scope.grade.gradevalue;
        $scope.grade.gradevalue = $scope.gradeOption;
        $scope.grade = clearFieldsService.clear($scope.grade);

        GradesService.update({studentId:$routeParams.id, embed:0}, $scope.grade, function(data) {
            localStorageService.remove('etag');
            $scope.grade._etag = data._etag;
            $scope.error = '';
            $scope.switchToNormalMode();
        }, function (error) {
            $scope.grade.gradevalue = tempGrade;
            if (error.status === 412) {
                $scope.error = 'You do not update the newest data. Refresh page and try again.';
            }
            else if (error.status === 422) {
                $scope.error = 'Incorrect data';
            }
            console.log(error);
        });
    };

    $scope.deleteGrade = function(grade) {
        if (popupService.showPopup('Really delete this?')) {
            localStorageService.set('etag', grade._etag);
            GradesService.delete({studentId:$routeParams.id, embed:0}, grade, function() {
                $location.path('/students/'+$routeParams.id);
            });
        }
    };

    $scope.initController();
});




app.controller('GradeAddCtrl', function ($scope, $location, $routeParams, StudentsService, ClassesService, 
    SubjectsService, TestsService, GradesService, UserService, localStorageService, clearFieldsService) {

    var clearVariables = function () {
        $scope.error = '';
        $scope.grade = new GradesService();
        $scope.subject = {};
        $scope.student = {};
        $scope.tests = [];
        $scope.subjects = [];
        $scope.classes = [];
        $scope.specificTest = false;
        $scope.allowedGrades = ['1', '1+', '2-', '2', '2+', '3-', '3', '3+', '4-', '4', '4+', '5-', '5', '5+', '6-', '6', '6+'];
    };

    $scope.initController = function () {
        clearVariables();
        getStudent();
        getClasses();
        if ($routeParams.optionalTestId !== undefined) {
            $scope.optionalTestId = $routeParams.optionalTestId;
            getTest();
        } else {
            getSubjects();
            getTests();
        }
    };

    var getSubjects = function () {
        SubjectsService.get(function (data) {
            $scope.subjects = data._items;
        });
    };

    var getStudent = function () {
        StudentsService.get({studentId:$routeParams.id}, function (data) {
            $scope.student = data;
        });
    };

    var getClasses = function () {
        ClassesService.get(function (data) {
            $scope.classes = data._items;
        });
    };

    var getTests = function () {
        TestsService.get({teacherId:localStorageService.get('myId')}, function (data) {
            $scope.tests = data._items;
        });
    };

    var getTest = function () {
        TestsService.get({testId:$routeParams.optionalTestId, teacherId:localStorageService.get('myId'), 
            embObj:'"subject_id":1'}, function (data) {
                $scope.specificTest = true;
                $scope.subject = data.subject_id.name;
                $scope.tests.push(data);
                $scope.grade.test_id = $scope.tests[0]._id;
            });
    };

    $scope.showTest = function(option){
        return option.subject_id === $scope.subject && 
        option.class_id === $scope.student.class_id;
    };

    function getThisTest() {
        for (var i in $scope.tests) {
            if ($scope.grade.test_id === $scope.tests[i]._id) {
                return $scope.tests[i];
            }
        }
        //$scope.grade.test_id === 
    }

    var addGradeMethod = function() {
        $scope.grade.student_id = $routeParams.id;
        $scope.grade.$save({studentId:$routeParams.id, embed:0}, function() {
            if ($scope.specificTest === true) {
                $location.path('/tests/'+$routeParams.optionalTestId+'/grades');
            } else {
                $location.path('/students/'+$routeParams.id);
            }
        }, function (error) {
            $scope.error = 'Error '+error.status +' '+ error.statusText;
            console.log(error);
        });
    };

    $scope.addGrade = function () {
        $scope.error = '';
        // if test.status == 0 -> change to 1, add grade if success
        var thisTest = getThisTest();
        if (thisTest.status === 0) {
            thisTest.status = 1;
            localStorageService.set('etag', thisTest._etag);
            thisTest = clearFieldsService.clear(thisTest);
            TestsService.update({teacherId:localStorageService.get('myId')}, thisTest, function() {
                localStorageService.remove('etag');
                addGradeMethod();
            }, function (error) {
                $scope.error = 'Error while updating test '+error.status +' '+ error.statusText;
                console.log(error);
            });
        } else {
            // add grade immediately
            addGradeMethod();
        }     
    };

    $scope.initController();
});