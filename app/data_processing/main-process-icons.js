'use strict';

/**
 * Retrieve icon rgb and grayscale
 * values and save to database.
 **/

// module dependencies
var util = require('util');
var async = require('async');
var bluebird = require('bluebird');
var imgDownloader = require('./modules/img-downloader');
var imgAnalyzer = require('./modules/img-analyzer');
var pconsole = require('./modules/p-console');
var appsController = require('./controllers/apps.controller');

// constants
var ROWS_PER_QUERY = 100;
var DELAY = 3000;

/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(offset, cb) {
  appsController
    .getUnProcessedRows(ROWS_PER_QUERY, offset)
    .then(function (rows) {
      var rowStart = offset + 1;
      var rowEnd = offset + ROWS_PER_QUERY;

      pconsole.dividor();
      pconsole.log('Downloading row ' + rowStart + ' - ' + rowEnd, true);
      return imgDownloader.bulkDownload(rows);
    })
    .then(function (images) {
      pconsole.log('Analyzing images', true);
      return imgAnalyzer.bulkAnalyze(images);
    })
    .then(function (images) {
      pconsole.log('Saving image info', true);
      return appsController.bulkSaveIconInfo(images);
    })
    .then(function () {
      setTimeout(function () {
        cb();
      }, DELAY);
    }, function (err) {
      cb(err);
    });
}

/**
 * Process all rows
 **/
function processAll(numRows, cb) {
  var offsets = [];

  console.log(numRows);

  for (var offset = 323200; offset < numRows; offset += ROWS_PER_QUERY) {
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
 * main function
 **/
function init() {
  async.waterfall([
    appsController.getNumRows,
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
