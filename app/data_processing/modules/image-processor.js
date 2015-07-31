'use strict';

var async = require('async');
var bluebird = require('bluebird');
var requestAsync = require('./request-async');
var conn = require('../../app/models/connection');

function processSingleRow(row, callback) {
  requestAsync()
    .then(function (result) {
      callback();
    }, function (err) {
      callback(err);
    });
}

function processRows(rows) {
  return new bluebird(function (resolve, reject) {
    async.seriesLimit(rows, 10, processSingleRow, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports = {
  processRows: processRows
};