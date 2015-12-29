'use strict';

/**
 * Module dependencies.
 */
var util = require('util');
var conn = require('../../data_processing/database/connection');

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
  var query = util.format(
    'SELECT id, track_name AS name, artwork_url60 AS icon_url, ' +
      'track_view_url AS app_url, dominant_color AS color ' +
    'FROM `apps` ' +
    'WHERE genre_id = %d',
    req.genre.id
  );

  conn.query(query).then(function (result) {
    var data = {
      summary: result
    };
    res.status(200).send(data);
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