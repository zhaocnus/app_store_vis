(function() {
  'use strict';

  function headerCtrl($scope) {
    $scope.tmp = 'Header';
  }

  angular.module('common.header', [])
    .controller('HeaderCtrl', [
      '$scope',
      headerCtrl
    ]);
})();
