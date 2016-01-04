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
      return 'null';
    }
  };

  // use "ON DUPLICATE KEY UPDATE id=id" to ignore insert if record already exists
  // http://stackoverflow.com/a/4920619/2259286
  var track_name = getValue('track_name');
      artwork_url60 = getValue('artwork_url60'),
      track_view_url = getValue('track_view_url'),
      description = getValue('description'),
      artist_name = getValue('artist_name');
  var query = util.format(
    'INSERT INTO `apps` (id, track_name, artwork_url60, track_view_url, description, artist_name) ' +
    'VALUES (%d, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=id',
    data.id,

    track_name,
    artwork_url60,
    track_view_url,
    description,
    artist_name
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
    'WHERE artwork_url60 IS NULL OR description IS NULL';

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
 * Gets rows without dominant colors
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
 * Gets rows without web save colors
 */
module.exports.getRowsForWebSaveColors = function(cb) {
  var query =
    'SELECT id, dominant_color ' +
    'FROM `apps` ' +
    'WHERE dominant_color IS NOT NULL';

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
      dominant_color = getValue('dominant_color'),
      web_save_color = getValue('web_save_color'),
      description = getValue('description'),
      artist_name = getValue('artist_name');

  var query = util.format(
    'UPDATE `apps` SET ' +
    'track_name = %s, ' +
    'artwork_url60 = %s, ' +
    'track_view_url = %s, ' +
    'genre_id = %s, ' +
    'dominant_color = %s, ' +
    'web_save_color = %s, ' +
    'description = %s, ' +
    'artist_name = %s ' +
    'WHERE id = %d',
    track_name,
    artwork_url60,
    track_view_url,
    genre_id.toString(),
    dominant_color,
    web_save_color,
    description,
    artist_name,
    parseInt(data.id, 10)
  );

  if (executeQuery) {
    return conn.query(query);
  } else {
    return query;
  }
};