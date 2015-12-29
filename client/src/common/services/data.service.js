(function() {
  'use strict';

  function dataService($resource) {
    return {
      icons: $resource('/api/icons/:iconId', {iconId: '@id'}),
      iconGrayscale: $resource('/api/icons_grayscale', {iconId: '@id'})
    };
  }

  angular.module('common.services.data', [])
    .factory('DataService', [
      '$resource',
      dataService
    ]);
})();
