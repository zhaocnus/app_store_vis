(function() {
  'use strict';

  function dataService($resource) {
    return {
      genres: $resource('/api/genres/:genreId')
    };
  }

  angular.module('common.services.data', [])
    .factory('DataService', [
      '$resource',
      dataService
    ]);
})();
