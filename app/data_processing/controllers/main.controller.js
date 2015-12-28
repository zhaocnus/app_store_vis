/**
 * genres controller
 **/

'use strict';

var util = require('util');
var bluebird = require('bluebird');

var conn = require('../database/connection');
var appsController = require('./apps.controller');
var genresController = require('./genres.controller');
var appsGenresController = require('./apps_genres.controller');

/**
 * bulk save apps to database
 * appDetailArr is in group of 50 OR less
 */
module.exports.bulkSave = function(appDetailArr) {
  var queries = [], queriesAppGenre = [];

  appDetailArr.forEach(function(data) {
    // save app
    var appId = parseInt(data.trackId, 10);
    var appData = {
      id: appId,
      track_name: data.trackName,
      artwork_url60: data.artworkUrl60,
      track_view_url: data.trackViewUrl
    };

    queries.push( appsController.save(appData, false) );

    // save app genres
    var genreId = conn.escape( parseInt(data.primaryGenreId, 10) );
    var genreData = {
      id: genreId,
      name: data.primaryGenreName
    };

    queries.push( genresController.save(genreData, false) );

    // save app-genre association
    var appGenreData = {
      app_id: appId,
      genre_id: genreId
    };

    queriesAppGenre.push( appsGenresController.save(appGenreData, false) );
  });

  // execute transactions and returns a promise
  var promises = [
    conn.execTransaction(queries),
    conn.execTransaction(queriesAppGenre)
  ];
  return bluebird.settle(promises);
};
