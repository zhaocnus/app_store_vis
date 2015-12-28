'use strict';

/**
 * Retrieve app icon dominant color and save to database.
 **/

// module dependencies
var util = require('util');
var async = require('async');
var bluebird = require('bluebird');

var iconProcessor = require('./modules/icon-processor');
var pconsole = require('./modules/p-console');
var appsController = require('./controllers/apps.controller');

// constants
var NUM_ROWS_PER_GROUP = 10;
var DELAY = 1000;

/**
 * Process all rows
 **/
function processAllRows(rows, cb) {
  pconsole.dividor();

  async.eachLimit(rows, NUM_ROWS_PER_GROUP,
    function (row, cb) {
      // get dominant color and save to DB
      iconProcessor.processIcon(row, function (err, value) {
        pconsole.inline('img saved: ' + row.id + ' color: ' + value.hex, true);

        appsController.update({
          id: row.id,
          dominant_color: value.hex
        }).then(function () {
          cb(null, value);
        }, function (err) {
          cb(err);
        });
      });
    },

    // err handler
    function (err) {
      throw err;
    }
  );
}

/**
 * main function
 **/
function init() {
  async.waterfall([
    appsController.getUnprocessedRows,
    processAllRows
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
