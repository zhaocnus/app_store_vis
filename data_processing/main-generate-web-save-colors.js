'use strict';

/**
 * Retrieve app icon dominant color and save to database.
 **/

// module dependencies
var async = require('async');

var conn = require('./database/connection');
var pconsole = require('./modules/p-console');
var appsController = require('./controllers/apps.controller');

/**
 * process all rows
 **/
function processAll(rows, callback) {
  var queries = [];
  rows.forEach(function (row) {
    var color = row.dominant_color,
        r = parseInt(color.substring(0, 2), 16),
        g = parseInt(color.substring(2, 4), 16),
        b = parseInt(color.substring(4, 6), 16);

    var hex = (Math.round(r/51) * 51).toString(16) +
      (Math.round(g/51) * 51).toString(16) +
      (Math.round(b/51) * 51).toString(16);

    var query = appsController.update({
      id: row.id,
      web_save_color: hex.toUpperCase()
    }, false);

    queries.push(query);

    console.log(query);
  });

  conn.execTransaction(queries).then(function () {
    pconsole.log(queries.length + ' rows are updated.');
    callback();
  }, function (err) {
    callback(err);
  })
}

/**
 * main function
 **/
function init() {
  pconsole.header('Generating web save colors.');

  async.waterfall([
    appsController.getRowsWithoutWebSaveColors,
    processAll
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.dividor();
    pconsole.header('All icons are processed.');
    process.exit(0);
  });
}

// run process
init();
