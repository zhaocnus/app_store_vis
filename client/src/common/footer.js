(function() {
  'use strict';

  function footerCtrl($scope) {
    $scope.tmp = 'Footer';
  }

  angular.module('common.footer', [])
    .controller('FooterCtrl', [
      '$scope',
      footerCtrl
    ]);
})();
