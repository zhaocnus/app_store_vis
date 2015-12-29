(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider.state('root', {
      url: '/',
      templateUrl: 'src/app/core/core.tpl.html',
      controller: 'CoreCtrl'
    });
  }

  angular.module('core', [])
    .config([
      '$stateProvider',
      config
    ]);
})();
