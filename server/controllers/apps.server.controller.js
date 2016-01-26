'use strict';

/**
 * Module dependencies.
 */
var conn = require('../../data_processing/database/connection');

/**
 * Show single app
 */
module.exports.show = function(req, res) {
  res.json(req.app);
};


/**
 * App middleware
 */
module.exports.appById = function (req, res, next, appId) {
  var query = 'SELECT * from `apps` WHERE id = ' + appId;

  conn.query(query).then(function (app) {
    if (app && app.length === 1) {
      req.app = app[0];
      next();
    } else {
      res.status(404).send('No app with that ID has been found.');
    }
  }, function () {
    res.status(404).send('No app with that ID has been found.');
  });
};