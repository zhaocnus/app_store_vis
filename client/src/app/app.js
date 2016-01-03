(function() {
  'use strict';

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
      url: '/',
      views: {
        'menu': {
          templateUrl: 'src/app/menu/menu.tpl.html'
        },
        'summary': {
          templateUrl: 'src/app/summary/summary.tpl.html',
        }
      }
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  angular.module('app', [
    // vendor modules
    'ui.router',
    'ngResource',

    // app sub-modules
    'common.services.data',
    'menu',
    'summary',
    'templates'
  ])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    config
  ]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

})();
