'use strict';



/**
 * Module to create sprite image using icons' grasyscale value
 */

// REF
// Combine multiple images using ImageMagick : (http://superuser.com/a/290679)

// Module dependencies
var async = require('async');
var pconsole = require('./modules/p-console');
var spriteCreator = require('./modules/sprite-creator');
var appsController = require('./controllers/apps.controller');

// constants
var ROWS_PER_QUERY = 1024;

/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(offset, cb) {
  appsController
    .getProcessedRowsInRange(ROWS_PER_QUERY, offset)
    .then(function (rows) {
      return spriteCreator.addIcons(rows);
    })
    .then(function () {
      cb();
    }, function (err) {
      throw err;
    });
}

/**
 * Process all rows
 **/
function processAll(numRows, cb) {
  var offsets = [];

  // debug: process only first 16000 rows
  //numRows = 160000;

  for (var offset = 0; offset < numRows; offset += ROWS_PER_QUERY) {
    offsets.push(offset);
  }

  async.eachSeries(offsets, processRows, function (err) {
    if (err) {
      throw err;
    }

    cb();
  });
}


/**
 * bulk process images array
 * @param {array} images array of images. {id: number, filename: string}
 * @return {Promise}
 */
function run() {
  async.waterfall([
    appsController.getNumRows,
    processAll
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.log('All Done.');
  });
}

run();
