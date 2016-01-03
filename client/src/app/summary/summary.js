(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider.state('root.summary', {
      url: 'summary/{genreId}',
      templateUrl: 'src/app/summary/summary-result.tpl.html',
      controller: 'SummaryResultCtrl'
    });
  }

  angular.module('summary', [])
    .config([
      '$stateProvider',
      config
    ]);
})();
