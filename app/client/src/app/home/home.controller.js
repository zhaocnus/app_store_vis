(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function homeCtrl($scope, DataService) {
    //$scope.icon = DataService.icons.get({iconId: 223});
    //$scope.icons = DataService.icons.query({max: 0, min: 0});

    DataService.iconGrayscale
      .query(function (grayscales) {
        // find max valueue
        var max = 0;
        angular.forEach(grayscales, function (g, index) {
          if (max < g.count) {
            max = g.count;
          }
        });

        // calculate each grayscale's percentage
        angular.forEach(grayscales, function (g, index) {
          var val = g.value;
          grayscales[index].color = 'rgb(' + val + ',' + val + ',' + val + ')';
          grayscales[index].per = (100 * g.count / max) + '%';
        });

        $scope.grayscales = grayscales;
      });

    $scope.onBarClicked = function (grayscale) {
      $scope.selectedGrayscale = grayscale;
      // LOAD ICONS
    };
  }

  angular.module('home')
    .controller('HomeCtrl', [
      '$scope',
      'DataService',
      homeCtrl
    ]);
})();
