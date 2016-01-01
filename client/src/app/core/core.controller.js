(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function coreCtrl($scope, $state, $stateParams, DataService) {
    $scope.genres = DataService.genres.query();

    $scope.genreSelected = function (genreId) {
      $scope.selectedId = genreId;
      $scope.isMobileListVisible = false;
    };

    // collapse button logic for mobile only
    $scope.isMobileListVisible = false;
    $scope.toggleMobileList = function() {
      $scope.isMobileListVisible = !$scope.isMobileListVisible;
    };

    console.log($stateParams);
  }

  angular.module('core')
    .controller('CoreCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'DataService',
      coreCtrl
    ]);
})();
