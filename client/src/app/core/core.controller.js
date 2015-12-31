(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function coreCtrl($scope, $state, DataService) {
    $scope.genres = DataService.genres.query();

    $scope.genreSelected = function (genreId) {
      $scope.selectedId = genreId;
    };
  }

  angular.module('core')
    .controller('CoreCtrl', [
      '$scope',
      '$state',
      'DataService',
      coreCtrl
    ]);
})();
