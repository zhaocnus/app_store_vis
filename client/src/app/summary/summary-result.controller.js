(function() {
  'use strict';

  function summaryResultCtrl($scope, $stateParams, DataService) {
    $scope.genreId = $stateParams.genreId;

    DataService.genres.get({genreId: $scope.genreId}, function (res) {
      // genre info
      $scope.genreName = res.genre.name;

      // summary groups
      angular.forEach(res.groups, function (group) {
        angular.forEach(group.apps, function (app) {
          app.icon_url = 'url(' + app.icon_url + ')';
        });
      });
      $scope.groupList = res.groups;

      // set default order
      $scope.curGroupOrder = '-len';
    });
  }

  angular.module('summary')
    .controller('SummaryResultCtrl', [
      '$scope',
      '$stateParams',
      'DataService',
      summaryResultCtrl
    ]);
})();
