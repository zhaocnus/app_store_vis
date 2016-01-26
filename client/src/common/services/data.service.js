(function() {
  'use strict';

  function dataService($resource) {
    return {
      genres: $resource('/api/genres/:genreId'),
      apps: $resource('/api/apps/:appId')
    };
  }

  angular.module('common.services.data', [])
    .factory('DataService', [
      '$resource',
      dataService
    ]);
})();
