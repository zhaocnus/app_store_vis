/**
 * Scrapes ios app details using ituens api
 *
 * Inspired by: http://blog.singhanuvrat.com/tech/crawl-itunes-appstore-to-get-list-of-all-apps
 **/

'use strict';

var async = require('async');
var itunesApi = require('./modules/itunes-api');
var pconsole = require('./modules/p-console');
var appsController = require('./controllers/apps.controller');

function init() {
  async.waterfall([

    // get apps without details
    appsController.getRowsWithoutDetails,

    // scrape ids for genre
    itunesApi.scrapeAllAppDetails
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.header('All done!!!');
  });
}

init();



