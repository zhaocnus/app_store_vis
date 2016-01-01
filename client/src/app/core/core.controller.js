(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function coreCtrl($scope, $state, $location, DataService) {
    $scope.genres = DataService.genres.query();

    // check if a genre is already select by url params
    // example: /summary/6010
    var params = $location.path().split('/');
    if (params.length === 2 && params[0] === 'summary') {

    }

    console.log(params);

    $scope.genreSelected = function (genreId) {
      $scope.selectedId = genreId;
      $scope.isMobileListVisible = false;
    };

    // collapse button logic for mobile only
    $scope.isMobileListVisible = false;
    $scope.toggleMobileList = function() {
      $scope.isMobileListVisible = !$scope.isMobileListVisible;
    };

    console.log($location.path());
  }

  angular.module('core')
    .controller('CoreCtrl', [
      '$scope',
      '$state',
      '$location',
      'DataService',
      coreCtrl
    ]);
})();
