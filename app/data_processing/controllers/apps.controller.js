/**
 * apps controller
 **/

'use strict';

var util = require('util');
var conn = require('../database/connection');
var dbUtil = require('../database/db-util');

/**
 * Insert new app
 */
module.exports.save = function(data, executeQuery) {
  var getValue = function (field) {
    if (field in data) {
      return conn.escape(data[field]);
    } else {
      return null;
    }
  };

  // use "ON DUPLICATE KEY UPDATE" to ignore insert if record already exists
  // http://stackoverflow.com/a/4920619/2259286
  var query = util.format(
    'INSERT INTO `apps` (id, track_name, artwork_url60, track_view_url) ' +
    'VALUES (%d, %s, %s, %s) ON DUPLICATE KEY UPDATE id=id',
    data.id,
    getValue('track_name'),
    getValue('artwork_url60'),
    getValue('track_view_url')
  );

  if (executeQuery) {
    return conn.query(query);
  } else {
    return query;
  }
};

/**
 * Gets rows without details
 */
module.exports.getRowsWithoutDetails = function(cb) {
  var query =
    'SELECT id FROM `apps` ' +
    'WHERE artwork_url60 IS NULL';

  conn.query(query)
    .then(function (data) {
      var ids = data.map(function (item) {
        return item.id;
      });

      cb(null, ids);
    }, function (err) {
      cb(err);
    });
};

/**
 * Gets un-processed rows using offset and limit
 */
module.exports.getRowsWithoutDominantColors = function(cb) {
  var query =
    'SELECT id, artwork_url60 AS url ' +
    'FROM `apps` ' +
    'WHERE dominant_color IS NULL';

  conn.query(query)
    .then(function (data) {
      cb(null, data);
    }, function (err) {
      cb(err);
    });
};

/**
 * Updates app
 */
module.exports.update = function(data, executeQuery) {
  var getValue = function (field) {
    if (field in data) {
      return conn.escape(data[field]);
    } else {
      return field;
    }
  };

  var track_name = getValue('track_name'),
      artwork_url60 = getValue('artwork_url60'),
      track_view_url = getValue('track_view_url'),
      genre_id = getValue('genre_id'),
      dominant_color = getValue('dominant_color');

  var query = util.format(
    'UPDATE `apps` SET ' +
    'track_name = %s,' +
    'artwork_url60 = %s,' +
    'track_view_url = %s,' +
    'genre_id = %s,' +
    'dominant_color = %s ' +
    'WHERE id = %d',
    track_name,
    artwork_url60,
    track_view_url,
    genre_id.toString(),
    dominant_color,
    data.id
  );

  if (executeQuery) {
    return conn.query(query);
  } else {
    return query;
  }
};