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

    scraper.getAllGenreUrls,

    function (urls, cb) {
      // scrape only ios games
      var regex = /(\/ios-games\/)/,
        filteredUrls = scraper.filterUrls(urls, regex);

      cb(null, filteredUrls);
    },

    function (filteredUrls, cb) {
      var progressCallback = function (appIds) {
        return itunesApi.processApps(appIds);
      };

      scraper.scrapeGenres(filteredUrls, progressCallback)
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



