(function() {
  'use strict';

  // This service to is expose hideMenu to external modules
  function menuService() {
    var mem = {
      value: false
    };

    return {
      mem: mem,
      set: function (value) {
        mem.value = value;
      },
      get: function () {
        return mem.value;
      }
    };
  }

  angular.module('common.header')
    .factory('MenuService', menuService);
})();
