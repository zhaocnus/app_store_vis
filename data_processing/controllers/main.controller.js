/**
 * genres controller
 **/

'use strict';

var util = require('util');
var bluebird = require('bluebird');

var conn = require('../database/connection');
var appsController = require('./apps.controller');
var genresController = require('./genres.controller');

/**
 * bulk save apps to database
 * appDetailArr is in group of 50 OR less
 */
module.exports.bulkSave = function(appDetailArr) {
  var appsQueries = [], genreQueries = [];

  appDetailArr.forEach(function(data) {
    var appId = parseInt(data.trackId, 10);
    var genreId = parseInt(data.primaryGenreId, 10);

    // save app
    var appData = {
      id: appId,
      track_name: data.trackName,
      artwork_url60: data.artworkUrl60,
      track_view_url: data.trackViewUrl,
      description: data.description,
      artist_name: data.artistName,
      genre_id: genreId
    };

    appsQueries.push( appsController.update(appData, false) );

    // save app genres
    var genreData = {
      id: genreId,
      name: data.primaryGenreName
    };

    genreQueries.push( genresController.save(genreData, false) );
  });

  // execute transactions and returns a promise
  var promises = [
    conn.execTransaction(genreQueries),
    conn.execTransaction(appsQueries)
  ];
  return bluebird.settle(promises);
};
