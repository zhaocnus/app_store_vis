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
//var ROWS_PER_QUERY = 100;
var NUM_ROWS_IN_GROUP = 100;
var DELAY = 3000;

/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(group, cb) {
  var rowStart = group.id * NUM_ROWS_IN_GROUP + 1,
      rowEnd = rowStart + NUM_ROWS_IN_GROUP;
  pconsole.dividor();
  pconsole.log('Downloading row ' + rowStart + ' - ' + rowEnd, true);

  imgDownloader.bulkDownload(group.data)
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
function processAll(rows, cb) {
  var groups = [],
      i = 0,
      len = rows.length;

  while (rows.length > 0) {
    groups.push({
      id: i,
      data: rows.splice(0, NUM_ROWS_IN_GROUP)
    });

    i += 1;
  }

  pconsole.log('Processing ' + len + ' rows in ' + groups.length + ' groups');

  async.eachSeries(groups, processRows, function (err) {
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
    appsController.getUnprocessedRows,
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
