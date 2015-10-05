(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function homeCtrl($scope, DataService) {
    //$scope.icon = DataService.icons.get({iconId: 223});
    //$scope.icons = DataService.icons.query({max: 0, min: 0});

    $scope.grayscales = DataService.iconGrayscale.query();
  }

  angular.module('home')
    .controller('HomeCtrl', [
      '$scope',
      'DataService',
      homeCtrl
    ]);
})();
