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
 	$scope.user.email = 'imie1nazw1@wp.pl';
 	$scope.user.password = 'password';
 	$scope.isError = false;
 	$scope.errorMsg = '';

 	$scope.initController = function() {
 			if (localStorageService.get('credentials')) {
 				$scope.isLoggedIn = true;
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
 					$location.path('/');
					$location.replace();
					window.location.reload();
 				},
 				function (error) {
 					console.log(error);
 					$scope.isLoggedIn = false;
 					$scope.isError = true;
 					$scope.errorMsg = 'Wrong email or password!';
 				});
		}
	};

	$scope.logout = function() {
        localStorageService.clearAll();
        $location.path('/');
		$location.replace();
		window.location.reload();
      };

    $scope.initController();
});