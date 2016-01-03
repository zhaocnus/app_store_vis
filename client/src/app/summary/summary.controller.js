(function() {
  'use strict';

  /**
   * @name  summaryCtrl
   * @description Controller
   */
  function summaryCtrl($scope, $state) {
    $scope.showDefault = $state.current.name === 'root';
  }

  angular.module('summary')
    .controller('SummaryCtrl', [
      '$scope',
      '$state',
      summaryCtrl
    ]);
})();
