(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    console.log('home');

    $stateProvider
      .state('root.home', {
        url: '/',
        views: {
          'main@': {
            templateUrl: 'src/app/home/home.tpl.html',
            controller: 'HomeCtrl'
          }
        }
      });
  }

  angular.module('home', [])
    .config([
      '$stateProvider',
      config
    ]);
})();
