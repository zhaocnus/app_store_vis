(function() {
  'use strict';

  function summaryResultCtrl($scope, $stateParams, DataService) {
    // default values
    $scope.genreId = $stateParams.genreId;
    $scope.loadingComplete = false; // show loading screen

    // toggle group app icons on click
    $scope.toggleGroupApps = function (group) {
      group.lazyLoadApps = group.lazyLoadApps ? null : group.apps;

      $scope.selectedApp = null;
    };

    // select app to show its detail
    $scope.selectApp = function (app) {
      var appId = app.id;

      $scope.selectedAppId = appId;

      DataService.apps.get({appId: appId}, function (res) {
        app.description = res.description;
        app.name = res.track_name;
        app.app_url = res.track_view_url;
      }, function (err) {
        $scope.err = err;
      });
    };

    $scope.unSelectApp = function () {
      $scope.selectedAppId = null;
    };

    // load genre data
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
    }, function (err) {
      $scope.err = err;
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
