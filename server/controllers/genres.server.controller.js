'use strict';

/**
 * Module dependencies.
 */
var util = require('util');
var conn = require('../../data_processing/database/connection');
var _ = require('lodash');

// List all genres
module.exports.list = function(req, res) {
  var query = 'SELECT * from `genres`';

  conn.query(query).then(function (result) {
    res.status(200).send(result);
  }, function (err) {
    res.status(404).send('Not found');
  });
};

// Read genre summary
module.exports.readGenreSummary = function(req, res) {
  // TODO: save this result in a json or in memory key/value DB
  // TODO: create a shortened description column
  var query = util.format(
    'SELECT id, track_name AS name, artwork_url60 AS icon_url, ' +
      'track_view_url AS app_url, web_save_color, artist_name AS artist, ' +
      'description ' +
      //'CONCAT( LEFT(description, 100), IF(LENGTH(description) > 100, "...", "") ) AS description ' +
    'FROM `apps` ' +
    'WHERE genre_id = %d ' +
    'AND web_save_color IS NOT NULL ' +
    'GROUP BY artist', // this removes similar icons
    req.genre.id
  );

  conn.query(query).then(function (rows) {
    // Use js object to group rows by web_save_color
    var dataObj = {};
    var max = 1;
    var total = rows.length;
    rows.forEach(function (row) {
      var color = row.web_save_color;
      if (dataObj.hasOwnProperty(color)) {
        dataObj[color].push(row);
      } else {
        dataObj[color] = [row];
      }

      var len = dataObj[color].length;
      if (len > max) {
        max = len;
      }
    });

    // convert group object to array
    var dataArr = [];
    _.forOwn(dataObj, function(value, key) {
      // value is an array containing all the icons
      // key is the web_save_color
      dataArr.push({
        len: value.length,
        percent: Math.round(100 * value.length / total) + '%',
        barWidth: Math.round(100 * value.length / max) + '%',
        apps: value,
        web_save_color: '#' + key
      });
    });

    // respond to client
    res.status(200).send({
      genre: req.genre,
      groups: dataArr,
      total: total
    });
  }, function () {
    res.status(404).send('No genre with that ID has been found.');
  });
};

/**
 * Genre middleware
 */
module.exports.genreById = function (req, res, next, genreId) {
  var id = parseInt(genreId, 10),
      query = util.format('SELECT * from `genres` WHERE id = %d', id);

  conn.query(query).then(function (genre) {
    if (genre && genre.length === 1) {
      req.genre = genre[0];
      next();
    } else {
      res.status(404).send('No genre with that ID has been found.');
    }
  }, function () {
    res.status(404).send('No genre with that ID has been found.');
  });
};