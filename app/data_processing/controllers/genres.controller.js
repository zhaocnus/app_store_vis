/**
 * genres controller
 **/

'use strict';

var util = require('util');
var conn = require('../database/connection');

// Save a new genre
module.exports.save = function(data, executeQuery) {
  var query = util.format(
    "INSERT INTO `genres` (id, name) VALUES (%d, %s) " +
    "ON DUPLICATE KEY UPDATE id=id",
    data.id, conn.escape(data.name)
  );

  if (executeQuery) {
    return conn.query(query); // returns a promise
  } else {
    return query; // returns query string
  }
};