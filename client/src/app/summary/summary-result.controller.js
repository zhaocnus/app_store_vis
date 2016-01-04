(function() {
  'use strict';

  function summaryResultCtrl($scope, $stateParams, DataService, ItunesDataService) {
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

        // pull detail info using itunes lookup id
        // TODO: save info in DB. itunes api is kinda slow
        ItunesDataService.lookupById(app.id).then(function (res) {
          if (res.data && res.data.results && res.data.results.length === 1) {
            var result = res.data.results[0];
            group.selectedApp.detail = {
              artistName: result.artistName,
              sellerName: result.sellerName
            };

            var desc = result.description.replace(/\r?\n|\r/g, ' ');
            group.selectedApp.detail.desc = desc.length > 120 ?
              (desc.substring(0, 120) + '...') : desc;
          }
        });
      };

      $scope.unSelectApp = function (group) {
        group.selectedApp = null;
      };
    });
  }

  angular.module('summary')
    .controller('SummaryResultCtrl', [
      '$scope',
      '$stateParams',
      'DataService',
      'ItunesDataService',
      summaryResultCtrl
    ]);
})();
