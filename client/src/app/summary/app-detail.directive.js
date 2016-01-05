(function() {
  'use strict';

  function appDetail($window) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {

      }
    };
  }

  angular.module('summary')
    .directive('xyzAppDetail', [
      '$window',
      appDetail
    ]);

})();
