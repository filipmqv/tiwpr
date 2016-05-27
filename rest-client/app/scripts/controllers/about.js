'use strict';

/**
 * @ngdoc function
 * @name restClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the restClientApp
 */
angular.module('restClientApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
