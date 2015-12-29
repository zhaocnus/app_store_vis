(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function coreCtrl($scope, GenresDataService) {
    GenresDataService.list().then(function (genres) {
      $scope.genres = genres;
    });

    $scope.onGenreSelected = function(genreId) {
      console.log(genreId);
    };
  }

  angular.module('core')
    .controller('CoreCtrl', [
      '$scope',
      'GenresDataService',
      coreCtrl
    ]);
})();
