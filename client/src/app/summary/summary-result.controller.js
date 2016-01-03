(function() {
  'use strict';

  function summaryResultCtrl($scope, $stateParams, DataService) {
    $scope.genreId = $stateParams.genreId;

    DataService.genres.get({genreId: $scope.genreId}, function (res) {
      // genre info
      $scope.genreName = res.genre.name;
      $scope.totalNumApps = res.total;

      // summary groups
      angular.forEach(res.groups, function (group) {
        // add 'url()' for background image
        angular.forEach(group.apps, function (app) {
          app.icon_url = 'url(' + app.icon_url + ')';
        });
      });
      $scope.groupList = res.groups;

      // set default order
      $scope.curGroupOrder = '-len';

      // toggle group app icons on click
      $scope.toggleGroupApps = function (group) {
        group.lazyLoadApps = group.lazyLoadApps ? null : group.apps;
        group.selectedApp = null;
      };

      // select app to show its detail
      $scope.selectApp = function (app, group) {
        group.selectedApp = app;
      };
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
