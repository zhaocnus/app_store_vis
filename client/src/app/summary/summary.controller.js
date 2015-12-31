(function() {
  'use strict';

  /**
   * @name  summaryCtrl
   * @description Controller
   */
  function summaryCtrl($scope, $stateParams, DataService) {
    console.log($stateParams);
  }

  angular.module('summary')
    .controller('SummaryCtrl', [
      '$scope',
      '$stateParams',
      'DataService',
      summaryCtrl
    ]);
})();
