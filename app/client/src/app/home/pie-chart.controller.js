(function() {
  'use strict';

  // References
  // http://www.benlesh.com/2014/09/working-with-svg-in-angular.html
  // https://docs.angularjs.org/api/ng/service/$compile
  // http://stackoverflow.com/a/27675374/2259286
  // http://www.benlesh.com/2013/08/angular-compile-how-it-works-how-to-use.html

  /**
   * @name  pieChartCtrl
   * @description Controller
   */
  function pieChartCtrl($scope, $compile, DataService) {
    DataService.iconGrayscale
      .query(function (grayscales) {
        // find max value
        var max = 0;
        angular.forEach(grayscales, function (g, index) {
          if (max < g.count) {
            max = g.count;
          }
        });

        // calculate each grayscale's value
        var centerX = 300,
            centerY = 300,
            radius = 250,
            angel = 360 / 256,
            radian = Math.PI / 128,
            startX = centerX,
            startY = centerY - radius,
            endX = startX + radius * Math.sin(radian),
            endY = startY + radius * (1 - Math.cos(radian));
        angular.forEach(grayscales, function (g, index) {
          var val = g.value,
              innerRadius = radius * (g.count / max),
              innerStartY = centerY - innerRadius,
              innerEndX = startX + innerRadius * Math.sin(radian),
              innerEndY = innerStartY + innerRadius * (1 - Math.cos(radian));

          g.rotation = (angel * index) + ',' + centerX + ',' + centerY;
          g.color = val + ',' + val + ',' + val;

          // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
          // Example: 'M200 100 A 100 100, 0, 0, 1, 300 200 L 200 200 Z';
          g.innerPath = 'M' + startX + ' ' + innerStartY +
            'A' + innerRadius + ' ' + innerRadius + ' ' +
            '0,0,0 ' + innerEndX + ' ' + innerEndY + ' ' +
            'L ' + centerX + ' ' + centerY + ' Z';

          g.outerPath = 'M' + startX + ' ' + startY +
            'A' + radius + ' ' + radius + ' ' +
            '0,0,0 ' + endX + ' ' + endY + ' ' +
            'L ' + centerX + ' ' + centerY + ' Z';
        });

        $scope.grayscales = grayscales;

        //$compile(document.getElementById('pie-chart'))($scope);
      });
  }

  angular.module('home')
    .controller('PieChartCtrl', [
      '$scope',
      '$compile',
      'DataService',
      pieChartCtrl
    ]);
})();
