'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('LoginCtrl', function ($scope, LoginService, UserService, localStorageService, $location) {

 	$scope.user = {};
 	$scope.userForm = {};
 	$scope.userForm.email = 'teacher1@wp.pl'; // teacher
 	//$scope.userForm.email = 'student1@wp.pl'; // student
 	$scope.userForm.password = 'password';
 	$scope.error = '';
 	$scope.myId = {};

 	$scope.initController = function() {
 			if (localStorageService.get('credentials')) {
 				$scope.isLoggedIn = true;
 				$scope.role = localStorageService.get('role');
 				$scope.myId = localStorageService.get('myId');
 				getUserInfo();
 			}
 			else {
 				$scope.isLoggedIn = false;
 			}
 	};

 	var getUserInfo = function () {
 		UserService.get({userId:$scope.myId}, function (data) {
 			$scope.user = data;
 		});
 	};

 	$scope.submit = function() {
 		if ($scope.userForm.email && $scope.userForm.password) {
 			localStorageService.clearAll();
 			LoginService.save($scope.userForm).$promise
 			.then(
 				function (data) {
 					localStorageService.set('credentials', data.hash);
 					localStorageService.set('role', data.role);
 					localStorageService.set('myId', data.myId);
 					$location.path('/');
					window.location.reload();
 				},
 				function (error) {
 					console.log(error);
 					$scope.isLoggedIn = false;
 					$scope.error = 'Wrong email or password!';
 				});
		}
	};

	$scope.logout = function() {
        localStorageService.clearAll();
        $location.path('/');
		window.location.reload();
      };

    $scope.initController();
});