/**
 * Scrapes ios app details using ituens api
 *
 * Inspired by: http://blog.singhanuvrat.com/tech/crawl-itunes-appstore-to-get-list-of-all-apps
 **/

'use strict';

var async = require('async');
var itunesApi = require('./modules/itunes-api');
var pconsole = require('./modules/p-console');

function init() {
  async.waterfall([

    // get all genre urls
    scraper.getAllGenreUrls,

    // scrape ids for genre
    scraper.scrapeAppIds
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.header('All done!!!');
  });
}

init();



