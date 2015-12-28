/**
 * apps_genres controller
 **/

'use strict';

var util = require('util');
var conn = require('../database/connection');

// Save a new genre
module.exports.save = function(data, executeQuery) {
  var query = util.format(
    'INSERT INTO `apps_genres` (app_id, genre_id) VALUES (%d,%d) ' +
    'ON DUPLICATE KEY UPDATE id=id',
    data.app_id, data.genre_id
  );

  if (executeQuery) {
    return conn.query(query); // returns a promise
  } else {
    return query; // returns query string
  }
};