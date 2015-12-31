(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider.state('root.summary', {
      url: 'summary/{genreId}',
      views: {
        'summary': {
          templateUrl: 'src/app/summary/summary.tpl.html',
          controller: 'SummaryCtrl'
        }
      }
    });
  }

  angular.module('summary', [])
    .config([
      '$stateProvider',
      config
    ]);
})();
