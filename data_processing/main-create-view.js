/**
 * This script saves the genre summary from MySQL into a LokiJS database
 */

'use strict';

var async = require('async');
var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var conn = require('./database/connection');
var pconsole = require('./modules/p-console');

function getGenres(callback) {
  var query = 'SELECT id from `genres`';

  conn.query(query).then(function (rows) {
    var genreIds = rows.map((genre) => {
      return genre.id;
    });

    callback(null, genreIds);
  }, function (err) {
    callback(err);
  });
}

/**
 * Creates summary for a genre
 * Returns an array
 **/
function saveGenreSummary(genreId, callback) {
  pconsole.log('Processing genre : ' + genreId);

  var query = util.format(
    'SELECT id, artwork_url60 AS icon_url, web_save_color, artist_name AS artist ' +
    'FROM `apps` ' +
    'WHERE genre_id = %d ' +
    'AND web_save_color IS NOT NULL ' +
    'GROUP BY artist', // this removes similar icons
    genreId
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

    // convert groups from Object to Array
    var dataArr = [];
    _.forOwn(dataObj, function(value, key) {
      // value is an array containing all the icons
      // key is the web_save_color
      dataArr.push({
        len: value.length,
        percent: (Math.round(10000 * value.length / total) / 100) + '%',
        barWidth: (Math.round(10000 * value.length / max) / 100) + '%',
        apps: value,
        web_save_color: '#' + key
      });
    });

    pconsole.log('Number of groups : ' + dataArr.length);
    pconsole.dividor();

    callback(null, {
      genreId: genreId.toString(),
      groups: dataArr,
      totalNumAppsInGroup: total
    });
  }, function (err) {
    callback(err);
  });
}

function main() {
  pconsole.header('Converting MySql database into LokiJS data');

  async.waterfall([
    // get genre ids
    getGenres,

    // get genres summary group
    function (genres, callback) {
      async.mapSeries(genres, saveGenreSummary, (err, groups) => {
        if (err) {
          return callback(err);
        }

        callback(null, groups);
      });
    },

    // save summary into LikiJS database
    function (groups, callback) {
      pconsole.log('Saving data to genere_summary.json');

      // convert groups from array to object
      var groupsObj = {};
      groups.forEach((group) => {
        groupsObj[group.genreId] = group;
      });

      var dest = path.resolve(__dirname, '../data_views/genre_summary.json');

      fs.writeFile(dest, JSON.stringify(groupsObj), (err) => {
        if(err) {
           return callback(err);
        }

        callback();
      });
    }
  ], (err) => {
    if (err) {
      throw err;
    }

    process.exit(0);
  });
}

main();




