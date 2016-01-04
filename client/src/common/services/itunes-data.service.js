(function() {
  'use strict';

  function dataService($http) {
    return {
      lookupById: function (id, callback) {
        var url = 'https://itunes.apple.com/lookup?id=' + id + '&callback=JSON_CALLBACK';
        return $http.jsonp(url);
      }
    };
  }

  angular.module('common.services.itunesData', [])
    .factory('ItunesDataService', [
      '$http',
      dataService
    ]);
})();
