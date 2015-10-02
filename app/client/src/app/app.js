(function() {
  'use strict';

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('!');

    console.log('config');

    // root state
    $stateProvider.state('root', {
      views: {
        'header': {
          templateUrl: 'src/common/header.tpl.html',
          controller: 'HeaderCtrl'
        },
        'footer': {
          templateUrl: 'src/common/footer.tpl.html',
          controller: 'FooterCtrl'
        }
      }
    });
  }

  angular.module('app', [
    // vendor modules
    'ui.router',

    // app sub-modules
    'common.header',
    'common.footer',
    'home',
    'templates'
  ])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    config
  ]);

  angular.element(document).ready(function() {
    console.log('ready');
    angular.bootstrap(document, ['app']);
  });

})();
