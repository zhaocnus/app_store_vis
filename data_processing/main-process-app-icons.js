'use strict';

/**
 * Retrieve app icon dominant color and save to database.
 **/

// module dependencies
var util = require('util');
var async = require('async');

var conn = require('./database/connection');
var iconProcessor = require('./modules/icon-processor');
var pconsole = require('./modules/p-console');
var appsController = require('./controllers/apps.controller');

// constants
var NUM_ROWS_IN_GROUP = 20;
var DELAY = 2000;

/**
 * Process all rows
 **/
function processRowGroup(group, callback) {
  pconsole.log('Processing group ' + group.id);

  var queries = [];

  async.each(group.rows,
    function (row, cb) {
      // get dominant color and get UPDATE query
      iconProcessor.processIcon(row, function (err, value) {
        if (err) {
          return cb();
        }

        var query = appsController.update({
          id: row.id,
          dominant_color: value.hex
        });

        queries.push(query);

        cb(null);
      });
    },

    // result handler
    function (err) {
      if (err) throw err;

      callback(null, queries);
    }
  );
}

/**
 * Split all rows into group and then add delay in between each group
 **/
function processAll(rows, callback) {
  var groups = [],
      i = 0,
      len = rows.length;

  while (rows.length > 0) {
    groups.push({
      id: i,
      rows: rows.splice(0, NUM_ROWS_IN_GROUP)
    });

    i += 1;
  }

  pconsole.log('Processing ' + len + ' rows in ' + groups.length + ' groups');

  async.eachSeries(groups,
    function (group, cb) {
      processRowGroup(group, function (err, queries) {
        if (err) throw err;

        conn.execTransaction(queries).then(function () {
          pconsole.log('Done', true);
          pconsole.newLine();

          setTimeout(function () {
            cb();
          }, DELAY);
        }, function (err) {
          cb(err);
        });
      });
    },
    function (err) {
      if (err) throw err;
    });
}

/**
 * main function
 **/
function init() {
  async.waterfall([
    appsController.getRowsWithoutDominantColors,
    processAll
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.dividor();
    pconsole.header('All icons are processed.');
    process.exit(0);
  });
}

// run process
init();
