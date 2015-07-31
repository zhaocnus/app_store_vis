/**
 * mysql connection module
 *
 **/

'use strict';

var bluebird = require('bluebird');
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/config').db);

function query(query) {
  return new bluebird(function (resolve) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;

      // Use the connection
      connection.query(query, function(err, result) {
        if (err) throw err;

        // done with the connection.
        connection.release();

        resolve(result);
      });
    });
  });
}

module.exports = {
  query: query,
  pool: pool
};