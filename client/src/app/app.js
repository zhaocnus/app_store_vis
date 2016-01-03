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
          controller: 'SummaryCtrl'
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
  ])
  .controller('AppCtrl', [
    '$rootScope',
    '$document',
    function ($rootScope, $document) {
      console.log('success');

      // scroll to page top on state change success
      $rootScope.$on('$stateChangeSuccess', function() {
        $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
      });
    }
  ])

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

})();
