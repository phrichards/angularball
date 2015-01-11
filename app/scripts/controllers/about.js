'use strict';

/**
 * @ngdoc function
 * @name angularBallApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularBallApp
 */
angular.module('angularBallApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
