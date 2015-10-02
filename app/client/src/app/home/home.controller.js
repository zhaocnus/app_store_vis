(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function homeCtrl($scope) {
    $scope.tmp = 'Home';
  }

  angular.module('home')
    .controller('HomeCtrl', [
      '$scope',
      homeCtrl
    ]);
})();
