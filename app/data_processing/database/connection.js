/**
 * mysql connection module
 **/

'use strict';

var bluebird = require('bluebird');
var async = require('async');
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

function execTransaction(queries) {
  return new bluebird(function (resolve) {
    async.waterfall([
      // get connection
      function (cb) {
        pool.getConnection(function (err, conn) {
          if (err) throw err;
          cb(null, conn);
        });
      },
      // begin transaction
      function (conn, cb) {
        conn.beginTransaction(function(err) {
          if (err) throw err;
          cb(null, conn);
        });
      },
      // execute all queries
      function (conn, cb) {
        // iterator for async map
        var iterator = function (query, next) {
          conn.query(query, function (err) {
            if (err) {
              return conn.rollback(function() {
                throw err;
              });
            }

            next();
          });
        };

        // execute all queries
        async.map(queries, iterator, function (err) {
          if (err) throw err;
          cb(null, conn);
        });
      },
      // commit
      function (conn, cb) {
        conn.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }

          conn.release();
          resolve();
          cb();
        });
      }
    ], function (err) {
      if (err) throw err;
    });
  });
}

module.exports = {
  query: query,
  escape: mysql.escape,
  execTransaction: execTransaction
};