'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the restClientApp
 */
 var app = angular.module('restClientApp');

 app.controller('LoginCtrl', function ($scope, LoginService, localStorageService, $location) {

 	$scope.user = {};
 	$scope.user.email = 'imie4nazw4@wp.pl'; // teacher
 	//$scope.user.email = 'imie1nazw1@wp.pl'; // student
 	$scope.user.password = 'password';
 	$scope.error = '';

 	$scope.initController = function() {
 			if (localStorageService.get('credentials')) {
 				$scope.isLoggedIn = true;
 				$scope.role = localStorageService.get('role');
 			}
 			else {
 				$scope.isLoggedIn = false;
 			}
 	};

 	$scope.submit = function() {
 		if ($scope.user.email && $scope.user.password) {
 			localStorageService.clearAll();
 			LoginService.save($scope.user).$promise
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