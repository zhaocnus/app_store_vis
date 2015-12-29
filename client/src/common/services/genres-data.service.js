(function() {
  'use strict';

  function genresDataService($http, $q) {
    var get = function (url) {
      return $q(function (resolve, reject) {
        $http.get(url).then(function (res) {
          resolve(res.data);
        }, function (err) {
          reject(err);
        });
      });
    };

    return {
      list: function () {
        return get('/api/genres');
      }
    };
  }

  angular.module('common.services.genresData', [])
    .factory('GenresDataService', [
      '$http',
      '$q',
      genresDataService
    ]);
})();
