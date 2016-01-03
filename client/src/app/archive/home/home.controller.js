(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function homeCtrl($scope, $compile, DataService) {
    //$scope.icon = DataService.icons.get({iconId: 223});
    //$scope.icons = DataService.icons.query({max: 0, min: 0});

    return;

    DataService.iconGrayscale
      .query(function (grayscales) {
        // find max value
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


    // http://www.benlesh.com/2014/09/working-with-svg-in-angular.html
    // https://docs.angularjs.org/api/ng/service/$compile
    // search for
    // http://stackoverflow.com/a/27675374/2259286
    // http://www.benlesh.com/2013/08/angular-compile-how-it-works-how-to-use.html
    $scope.path = 'M200 100 A 100 100, 0, 0, 1, 300 200 L 200 200 Z';
    //$compile(document.getElementById('pie'))($scope);
  }

  angular.module('home')
    .controller('HomeCtrl', [
      '$scope',
      '$compile',
      'DataService',
      homeCtrl
    ]);
})();
