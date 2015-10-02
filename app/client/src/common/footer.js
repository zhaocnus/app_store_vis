(function() {
  'use strict';

  function footerCtrl($scope) {
    $scope.tmp = 'Footer';
    console.log($scope);
  }

  angular.module('common.footer', [])
    .controller('FooterCtrl', [
      '$scope',
      footerCtrl
    ]);
})();
