(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function coreCtrl($scope, DataService) {
    $scope.genres = DataService.genres.query();

    $scope.onGenreSelected = function(genreId) {
      DataService.genres.get({genreId: genreId}, function (res) {
        console.log(res.summary);
      });
    };
  }

  angular.module('core')
    .controller('CoreCtrl', [
      '$scope',
      'DataService',
      coreCtrl
    ]);
})();
