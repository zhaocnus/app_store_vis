'use strict';

/**
 * Retrieve icon rgb and grayscale
 * values and save to database.
 **/

// module dependencies
var util = require('util');
var async = require('async');
var bluebird = require('bluebird');
var conn = require('./database/connection');
var imgDownloader = require('./modules/img-downloader');
var imgAnalyzer = require('./modules/img-analyzer');
var imgSave = require('./modules/img-save');
var pconsole = require('./modules/p-console');

// constants
var ROWS_PER_QUERY = 100;
var DELAY = 3000;

/**
 * Gets number of rows in apps_simple table
 **/
function getNumRows(cb) {
  var query = 'SELECT COUNT(*) AS count FROM apps';
  conn.query(query)
    .then(function (result) {
      cb(null, result[0].count);
    }, function (err) {
      cb(err);
    });
}

/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(offset, cb) {
  // NOT NULL filename means this
  // row has already been processed
  var query = util.format(
    'SELECT track_id AS id, ' +
      'artwork_url60 AS url ' +
    'FROM apps ' +
    'WHERE filename IS NULL ' +
    'LIMIT %d OFFSET %d',
    ROWS_PER_QUERY, offset);

  conn.query(query)
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
      return imgSave.bulkSave(images);
    })
    .then(function () {
      setTimeout(function () {
        cb()
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

    for (var offset = 0; offset < numRows; offset+=ROWS_PER_QUERY) {
      offsets.push(offset);
    }

    async.eachSeries(offsets, processRows, function (err) {
      if (err) {
        return cb(err);
      }

      resolve();
    });
}

/**
 * main function
 **/
function init() {
  async.waterfall([
    getNumRows,
    processAll
  ], function (err) {
    throw err;
  });
}

// run process
init();
