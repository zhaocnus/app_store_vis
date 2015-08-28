/**
 * apps controller
 **/

'use strict';

var util = require('util');
var conn = require('../database/connection');
var dbUtil = require('../database/db-util');

// order of COLUMNS_ARR and COLUMNS_STR needs to match
var COLUMNS_ARR = [{
  name: 'trackId',
  field: 'track_id'
}, {
  name: 'trackName',
  field: 'track_name'
}, {
  name: 'artworkUrl60',
  field: 'artwork_url60'
}];

var COLUMNS_STR = '(`track_id`, `track_name`, `artwork_url60`)';

var DUPLICATE_UPDATE_STR = dbUtil.getBulkDuplicateUpdateStr(COLUMNS_ARR);

/**
 * Filters json file returned from itunes api
 */
function filterAppDetail(appDetail) {
  var row = [];

  COLUMNS_ARR.forEach(function (value) {
    var key = value.name;

    if (appDetail.hasOwnProperty(key)) {
      row.push(appDetail[key]);
    } else {
      row.push(null);
    }
  });

  return row;
}

/**
 * bulk save apps to database
 * appDetailArr is in group of 50 OR less
 */
module.exports.bulkSave = function(appDetailArr) {
  var rows = [];

  appDetailArr.forEach(function(appDetail) {
    var filteredData = filterAppDetail(appDetail)
    rows.push(filteredData);
  });

  var query = util.format(
    'INSERT INTO `apps` %s VALUES %s ON DUPLICATE KEY UPDATE %s',
    COLUMNS_STR,
    conn.escape(rows),
    DUPLICATE_UPDATE_STR
  );

  return conn.query(query);
};

/**
 * Gets total number of rows
 */
module.exports.getNumRows = function(cb) {
  var query = 'SELECT COUNT(track_id) AS count FROM apps';
  conn.query(query)
    .then(function (result) {
      cb(null, result[0].count);
    }, function (err) {
      cb(err);
    });
};

/**
 * Gets un-processed rows using offset and limit
 */
module.exports.getUnProcessedRows = function(limit, offset) {
  // NOT NULL filename means this
  // row has already been processed
  var query = util.format(
    'SELECT track_id AS id, ' +
      'artwork_url60 AS url ' +
    'FROM apps ' +
    'WHERE filename IS NULL ' +
    'LIMIT %d OFFSET %d',
    limit, offset);

  return conn.query(query);
};

/**
 * bulk save icon information
 */
module.exports.bulkSaveIconInfo = function(images) {
  // prepare update queries
  var queries = [];
  images.forEach(function (img) {
    if (!img) {
      return;
    }

    var query = util.format(
      "UPDATE `apps` " +
      "SET `grayscale` = %d, `hex` = '%s', `filename` = '%s' " +
      "WHERE `track_id` = %d" ,
      img.grayscale, img.hex, img.filename, img.id);

    queries.push(query);
  });

  // execute transaction
  return conn.execTransaction(queries);
}