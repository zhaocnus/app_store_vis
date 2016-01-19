(function() {
  'use strict';

  function summaryResultCtrl($scope, $stateParams, DataService, ItunesDataService) {
    $scope.genreId = $stateParams.genreId;
    $scope.loadingComplete = false; // show loading screen

    DataService.genres.get({genreId: $scope.genreId}, function (res) {
      $scope.loadingComplete = true; // hide loading screen

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

        $scope.selectedApp = null;
      };

      // select app to show its detail
      $scope.selectApp = function (appId) {
        $scope.selectedAppId = appId;
      };

      /*
      $scope.loadMore = function () {
        // pull detail info using itunes lookup id
        ItunesDataService.lookupById($scope.selectedAppId).then(function (res) {
          if (res.data && res.data.results && res.data.results.length === 1) {
            var result = res.data.results[0];
            group.selectedApp.detail = {
              artistName: result.artistName
            };

            var desc = result.description.replace(/\r?\n|\r/g, ' ');
            group.selectedApp.detail.desc = desc.length > 120 ?
              (desc.substring(0, 120) + '...') : desc;
          }
        });
      };
      */

      $scope.unSelectApp = function (appId) {
        $scope.selectedAppId = null;
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
