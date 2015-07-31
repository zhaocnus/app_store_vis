'use strict';

/**
 * Retrieve icon rgb and grayscale
 * values and save to database.
 **/

// module dependencies
var async = require('async');
var bluebird = require('bluebird');
var conn = require('../app/models/connection');
var imageProcessor = require('./modules/image-processor');

// constants
var ROWS_PER_QUERY = 100;

/**
 * Gets number of rows in apps_simple table
 **/
function getNumRows() {
  return new bluebird(function (resolve, reject) {
    var query = 'SELECT COUNT(*) AS count FROM apps_simple';
    conn.query(query)
      .then(function (result) {
        resolve(result[0].count);
      }, function (err) {
        reject(err);
      });
  });
}

/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(offset, callback) {
  var query = 'SELECT id, artwork_url60' +
    ' FROM apps_simple' +
    ' LIMIT ' + ROWS_PER_QUERY +
    ' OFFSET ' + offset;

  conn.query(query)
    .then(function (rows) {
      var rowStart = offset + 1,
        rowEnd = offset + ROWS_PER_QUERY;
      process.stdout.write('\rProcessing row ' + rowStart + ' - ' + rowEnd);

      return imageProcessor.process(rows);
    })
    .then(function () {
      process.stdout.write(' | Complete');
      callback();
    }, function (err) {
      callback(err);
    });
}

/**
 * Process all rows
 **/
function processAll(numRows) {
  return new bluebird(function (resolve, reject) {
    var offsets = [];

    for (var offset = 0; offset < numRows; offset++) {
      offsets.push(offset);
    }

    async.eachSeries(offsets, processRows, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

/**
 * main function
 **/
function init() {
  getNumRows()
  .then(function (numRows) {
    console.log('Number of rows : ' + numRows);
    return processAll(numRows);
  })
  .then(function () {
    console.log('All done!');
  }, function (err) {
    console.log(err);
  })
  .catch(function (err) {
    throw err;
  });
}

// run process
//init();

var requestAsync = require('./modules/request-async');
var url = 'http://is3.mzstatic.com/image/pf/us/r30/Purple3/v4/c2/fb/bc/c2fbbc9e-7470-7048-d7be-24ce6cdf82cf/AppIcon60x60_U00402x.png';
requestAsync(url)
  .then(function (result) {
    console.log(result);
  }, function (err) {
    console.log(err);
  });







