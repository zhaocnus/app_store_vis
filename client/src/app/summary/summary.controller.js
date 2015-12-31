(function() {
  'use strict';

  /**
   * @name  summaryCtrl
   * @description Controller
   */
  function summaryCtrl($scope, $stateParams, DataService) {
    $scope.genreId = $stateParams.genreId;

    DataService.genres.get({genreId: $scope.genreId}, function (res) {
      console.log(res);
    });
  }

  angular.module('summary')
    .controller('SummaryCtrl', [
      '$scope',
      '$stateParams',
      'DataService',
      summaryCtrl
    ]);
})();
