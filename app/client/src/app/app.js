(function() {
  'use strict';

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

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

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  angular.module('app', [
    // vendor modules
    'ui.router',
    'ngResource',

    // app sub-modules
    'common.services.data',
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
    angular.bootstrap(document, ['app']);
  });

})();
