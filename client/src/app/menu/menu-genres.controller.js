(function() {
  'use strict';

  function genresCtrl($scope, DataService) {
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
  }

  angular.module('menu')
    .controller('GenresCtrl', [
      '$scope',
      'DataService',
      genresCtrl
    ]);
})();
