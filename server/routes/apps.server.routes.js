'use strict';

var appsController = require('../../server/controllers/apps');

module.exports = function(app) {
  app.route('/api/apps/:appId')
    .get(appsController.show);

  // Finish by binding the genre middleware
  app.param('appId', appsController.appById);
};
