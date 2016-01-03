(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider.state('root', {
      url: '/',
      views: {
        'menu': {
          templateUrl: 'src/app/menu/menu.tpl.html',
          controller: 'MenuCtrl'
        },
        'summary': {
          templateUrl: 'src/app/summary/default.tpl.html',
        }
      }
    });

    console.log('root');
  }

  angular.module('core', [])
    .config([
      '$stateProvider',
      config
    ]);
})();
