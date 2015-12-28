/**
 * Scrapes ios app using itunes.apple.com and ituens api
 *
 * Inspired by: http://blog.singhanuvrat.com/tech/crawl-itunes-appstore-to-get-list-of-all-apps
 **/

'use strict';

var async = require('async');
var scraper = require('./modules/scraper');
var itunesApi = require('./modules/itunes-api');
var pconsole = require('./modules/p-console');

function init() {
  async.waterfall([

    // get all genre urls
    scraper.getAllGenreUrls,

    // scrape ids for genre
    function (genreUrls, cb) {
      var progressCallback = function (appIds) {
        return itunesApi.processApps(appIds);
      };

      scraper.scrapeGenres(genreUrls, progressCallback)
        .then(function () {
          cb(null);
        }, function (err) {
          cb(err);
        });
    }
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.header('All done!!!');
  });
}

init();



