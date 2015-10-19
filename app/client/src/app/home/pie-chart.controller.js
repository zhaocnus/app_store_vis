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

        var centerX = 300,
            centerY = 300,
            radius = 150,
            maxOffset = 100,
            angel = 360 / 256,
            radian = Math.PI / 128,
            sin = Math.sin(radian),
            cos = Math.cos(radian);
        var borderPath = 'M' + centerX + ' ' + (centerY - radius - maxOffset) +
            'L' + centerX + ' ' + (centerY - radius);
        var maxRadius = radius + maxOffset;
        var hitAreaPath = 'M' + centerX + ' ' + (centerY - radius - maxOffset) +
            'A' + maxRadius + ' ' + maxRadius + ' ' +
            '0,0,1 ' + (centerX + maxRadius * sin) + ' ' + (centerY - maxRadius * cos) + ' ' +
            'L' + (centerX + radius * sin) + ' ' + (centerY - radius * cos) + ' ' +
            'A' + radius + ' ' + radius + ' ' +
            '0,0,0 ' + centerX + ' ' + (centerY - radius) + 'Z';

        angular.forEach(grayscales, function (g, index) {
          var val = g.value,
              offset = maxOffset * g.count / max,
              outerRadius = radius + offset,
              innerRadius = radius,
              x1 = centerX,
              y1 = centerY - outerRadius,
              x2 = centerX + outerRadius * sin,
              y2 = centerY - outerRadius * cos,
              x3 = centerX + innerRadius * sin,
              y3 = centerY - innerRadius * cos,
              x4 = centerX,
              y4 = centerY - innerRadius;

          // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
          g.valuePath = 'M' + x1 + ' ' + y1 +
            'A' + outerRadius + ' ' + outerRadius + ' ' +
            '0,0,1 ' + x2 + ' ' + y2 + ' ' +
            'L' + x3 + ' ' + y3 + ' ' +
            'A' + innerRadius + ' ' + innerRadius + ' ' +
            '0,0,0 ' + x4 + ' ' + y4 + 'Z';
            //'L' + x1 + ' ' + y1;
          g.borderPath = borderPath;
          g.hitAreaPath = hitAreaPath;
          g.rotation = (angel * index) + ',' + centerX + ',' + centerY;
          g.color = val + ',' + val + ',' + val;
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
