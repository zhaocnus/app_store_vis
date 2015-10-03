(function() {
  'use strict';

  function dataService($resource) {
    return {
      icons: $resource('/api/icons/:iconId', {iconId: '@id'})
    };
  }

  angular.module('common.services.data', [])
    .factory('DataService', [
      '$resource',
      dataService
    ]);
})();
