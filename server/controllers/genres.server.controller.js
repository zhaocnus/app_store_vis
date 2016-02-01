'use strict';

/**
 * Module dependencies.
 */
var util = require('util');
var conn = require('../../data_processing/database/connection');
var _ = require('lodash');
var genereSummary = require('../../data_views/genre_summary.json');

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
  var result = genereSummary[req.genre.id.toString()];

  if (!result) {
    return res.status(404).send('No genre with that ID has been found.');
  }

  res.status(200).send({
    genre: req.genre,
    groups: result.groups,
    total: result.totalNumAppsInGroup
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