/**
 * Scrapes ios app ID from https://itunes.apple.com
 *
 **/

'use strict';

var cheerio = require('cheerio');
var async = require('async');
var bluebird = require('bluebird');
var requestAsync = require('./request-async');
var pconsole = require('./p-console');

// URL LEVELS
// There are totally 4 levels
// main/genre/letter(A...Z*)/page(1,2,...)
// MAIN:      https://itunes.apple.com/us/genre/ios/id36?mt=8
// GENRE:     https://itunes.apple.com/us/genre/ios-books/id6018?mt=8
// LETTER:    https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A
// PAGE:      https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A&page=1#page

// get page by letter
// URL pattern:
// url: https://itunes.apple.com/us/genre/ios-books/id6018?mt=8
// main alphabetical list: url + '&letter=A'
// sub alphabetical list: url + '&letter=A' + '&page=2#page'

// LETTER
// We can go through all the letters by using this
// <div id="selectedgenre">
//   <ul class="list alpha">
//     <li>
//       <a href="https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A" title="Browse More Books">A</a>
// ...
// Or it's also save to just use to A-Z and * directly

// To check if we reach to the last PAGE of a Selected Letter:
// check if Next bottom exists:
// <div id="selectedgenre">
//   <ul class="list paginate">
//     <li>
//       <a href="..." class="paginate-more">Next</a>

// On PAGE level, the individual app is a <a> like this
// <div id="selectedcontent" class="grid3-column">
//   <div class="column first">
//     <ul>
//       <li>
//         <a href="https://itunes.apple.com/us/app/kindle-read-books-ebooks-magazines/id302584613?mt=8">...</a>

// The FINAL goal here is to get the app id: 302584613


// find all GENRE urls from itunes MAIN page
function getGenreLevel(html) {
	var urls = [];
	var pattern = 'https://itunes.apple.com/us/genre/';
	var $ = cheerio.load(html);

	$('#genre-nav a').each(function () {
		var href = $(this).attr('href');
		if (href.indexOf(pattern) > -1) {
			urls.push(href);
		}
	});

	return urls;
}

function getLetterLevel(urls) {
  var all = [];

  // loop through all genres
  urls.forEach(function (url) {
    // A-Z
    for (var i = 65; i <= 90; i++) {
      var letterUrl = url + '&letter=' + String.fromCharCode(i);
      all.push({
        base: letterUrl,
        page: 1
      });
    }

    // *
    all.push({
      base: url + '&letter=*',
      page: 1
    });
  });

  return all;
}

// url example:
// https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A&page=2#page
// On /genre/letter/page-num/ level, the individual app is a <a> like this
// <div id="selectedcontent" class="grid3-column">
//   <div class="column first">
//     <ul>
//       <li>
//         <a href="https://itunes.apple.com/us/app/kindle-read-books-ebooks-magazines/id302584613?mt=8">...</a>

// To determine if it is last page of a
// paricular letter, check if Next bottom exists:
// <div id="selectedgenre">
//   <ul class="list paginate">
//     <li>
//       <a href="..." class="paginate-more">Next</a>
function getAppId(options, callback) {
	var pageNum = options.page,
  	baseUrl = options.base,
  	url = baseUrl + '&page=' + pageNum + '#page';
	var ids = typeof options.ids === 'undefined' ? [] : options.ids;

	pconsole.inline(baseUrl + ' | page: ' + pageNum, true);

	requestAsync(url).then(function (html) {
		var $ = cheerio.load(html);

		$('#selectedcontent li a').each(function () {
      // example: https://itunes.apple.com/us/app/online-fitting/id600748799?mt=8
      var href = $(this).attr('href');
      var id = href.split('/').pop().slice(2, -5);
      ids.push(id);
    });

    // there are 2 'Next' buttons
    var hasMore = $('#selectedgenre li .paginate-more').length > 0;

    if (hasMore) {
    	pageNum++;
    	getAppId({
    		ids: ids,
    		base: baseUrl,
    		page: pageNum
    	}, callback);
    } else {
      pconsole.newLine();
    	callback(null, ids);
    }
  }, function (err) {
  	callback(err);
  });
}

function scrapeGenres(genreLevelUrls, progressCallback) {
  pconsole.header('Scraping itunes website');

  return new bluebird(function (resolve, reject) {
    // get all the letter pages of all the genres
    var letterLevelUrls = getLetterLevel(genreLevelUrls);

    // get all ids in series
    async.eachSeries(letterLevelUrls, function (url, callback) {
      pconsole.dividor();

      getAppId(url, function (err, ids) {
        if (err) {
          callback(err);
          return;
        }

        // wait for progressCallback to execute
        // and then process the next url
        progressCallback(ids).then(function() {
          callback(null);
        }, function(err) {
          callback(err);
        });
      });
    }, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

/**
 * Gets all genre urls from itunes.apple.com
 **/
function getAllGenreUrls(cb) {
  pconsole.header('Getting all genre urls');

  var homeUrl = 'https://itunes.apple.com/us/genre/ios/id36?mt=8';

  requestAsync(homeUrl)
    .then(function (html) {
      var genreLevelUrls = getGenreLevel(html);
      cb(null, genreLevelUrls);
    }, function (err) {
      cb('Error : getAllGenreUrls');
    })
    .catch(function (err) {
      throw err;
    });
}

/**
 * Filters url array by a regular expression
 * Return: filtered array
 **/
function filterUrls(urls, regex) {
  pconsole.header('Filtering all genre urls');

  var filteredUrls = [];
  urls.forEach(function (url) {
    if (url.match(regex)) {
      filteredUrls.push(url);
    }
  });

  return filteredUrls;
}

module.exports = {
  getAllGenreUrls: getAllGenreUrls,
  filterUrls: filterUrls,
  scrapeGenres: scrapeGenres
};




