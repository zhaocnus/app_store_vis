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
  field: 'id'
}, {
  name: 'trackName',
  field: 'track_name'
}, {
  name: 'artworkUrl60',
  field: 'artwork_url60'
}, {
  name: 'trackViewUrl',
  field: 'track_view_url'
}, {
  name: 'primaryGenreId',
  field: 'genre_id'
}];

var COLUMNS_STR = '(`id`, `track_name`, `artwork_url60`, `track_view_url`, `genre_id`)';

var DUPLICATE_UPDATE_STR = dbUtil.getBulkDuplicateUpdateStr(COLUMNS_ARR);


module.exports.save = function(data, executeQuery) {
  // use "ON DUPLICATE KEY UPDATE" to ignore insert if record already exists
  // http://stackoverflow.com/a/4920619/2259286
  var query = util.format(
    "INSERT INTO `apps` (id, track_name, artwork_url60, track_view_url, genre_id) " +
    "VALUES (%d, %s, %s, %s, %d) ON DUPLICATE KEY UPDATE id=id",
    data.id,
    conn.escape(data.track_name),
    conn.escape(data.artwork_url60),
    conn.escape(data.track_view_url),
    conn.escape(data.genre_id)
  );

  if (executeQuery) {
    return conn.query(query);
  } else {
    return query;
  }
};

/**
 * Gets un-processed rows using offset and limit
 */
module.exports.getUnprocessedRows = function(cb) {
  // NOT NULL filename means this
  // row has already been processed
  var query =
    'SELECT id AS id, artwork_url60 AS url ' +
    'FROM `apps` ' +
    'WHERE dominant_color IS NULL';

  conn.query(query)
    .then(function (result) {
      cb(null, result);
    }, function (err) {
      cb(err);
    });
};

/**
 * Updates app
 */
module.exports.update = function(data, cb) {
  var getValue = function (field) {
    if (field in data) {
      return conn.escape(data[field]);
    } else {
      return field;
    }
  };

  var track_name = getValue('track_name'),
      artwork_url60 = getValue('artwork_url60'),
      track_view_url = getValue('track_name'),
      genre_id = getValue('genre_id'),
      dominant_color = getValue('dominant_color');

  var query = util.format(
    "UPDATE `apps` SET " +
    "track_name = %s," +
    "artwork_url60 = %s," +
    "track_view_url = %s," +
    "genre_id = %s," +
    "dominant_color = %s " +
    "WHERE id = %d",
    track_name,
    artwork_url60,
    track_view_url,
    genre_id.toString(),
    dominant_color,
    data.id
  );

  return conn.query(query);
};







/**
 * Gets processed rows by offset and limit
 */
module.exports.getProcessedRowsInRange = function(limit, offset) {
  var query = util.format(
    'SELECT * ' +
    'FROM apps ' +
    'WHERE `dominant_color` IS NOT NULL ' +
    'LIMIT %d OFFSET %d',
    limit, offset);

  return conn.query(query);
};

/**
 * bulk save apps to database
 * appDetailArr is in group of 50 OR less
 */
module.exports.bulkSave = function(appDetailArr, executeQuery) {
  var rows = [];

  appDetailArr.forEach(function(appDetail) {
    var filteredData = filterAppDetail(appDetail)
    rows.push(filteredData);
  });

  // use "ON DUPLICATE KEY UPDATE" to ignore insert if record already exists
  // http://stackoverflow.com/a/4920619/2259286
  var query = util.format(
    'INSERT INTO `apps` %s VALUES %s ON DUPLICATE KEY UPDATE %s',
    COLUMNS_STR,
    conn.escape(rows),
    DUPLICATE_UPDATE_STR
  );

  if (executeQuery) {
    return conn.query(query);
  } else {
    return query;
  }
};

/**
 * Gets total number of rows
 */
module.exports.getNumRows = function(cb) {
  var query = 'SELECT COUNT(id) AS count FROM `apps`';
  conn.query(query)
    .then(function (result) {
      cb(null, result[0].count);
    }, function (err) {
      cb(err);
    });
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
      "SET `dominant_color` = '%s' " +
      "WHERE `id` = %d" ,
      img.hex, img.id);

    queries.push(query);
  });

  // execute transaction
  return conn.execTransaction(queries);
};