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

// limit number of apps for each letter,
// meaning the total number of apps per
// genre is MAX_NUM_APP_PER_LETTER * 27
var MAX_NUM_APPS_PER_LETTER = 5;

// number of ids in a group for bulk processing
var ID_GROUP_MAX_NUM = 200;

/*
Scrape logic
-------------------------------------------
URL LEVELS
There are totally 4 levels
main/genre/letter(A...Z*)/page(1,2,...)
MAIN:      https://itunes.apple.com/us/genre/ios/id36?mt=8
GENRE:     https://itunes.apple.com/us/genre/ios-books/id6018?mt=8
LETTER:    https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A
PAGE:      https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A&page=1#page

get page by letter
URL pattern:
url: https://itunes.apple.com/us/genre/ios-books/id6018?mt=8
main alphabetical list: url + '&letter=A'
sub alphabetical list: url + '&letter=A' + '&page=2#page'

LETTER
We can go through all the letters by using this
<div id="selectedgenre">
  <ul class="list alpha">
    <li>
      <a href="https://itunes.apple.com/us/genre/ios-books/id6018?mt=8&letter=A" title="Browse More Books">A</a>
...
Or it's also save to just use to A-Z and * directly

To check if we reach to the last PAGE of a Selected Letter:
check if Next bottom exists:
<div id="selectedgenre">
  <ul class="list paginate">
    <li>
      <a href="..." class="paginate-more">Next</a>

On PAGE level, the individual app is a <a> like this
<div id="selectedcontent" class="grid3-column">
  <div class="column first">
    <ul>
      <li>
        <a href="https://itunes.apple.com/us/app/kindle-read-books-ebooks-magazines/id302584613?mt=8">...</a>

The FINAL goal here is to get the app id: 302584613

*/


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
function getAppIdsByLetter(options, callback) {
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

    // check if there is need to scrape more data
    var hasMore = ids.length < MAX_NUM_APPS_PER_LETTER && $('#selectedgenre li .paginate-more').length > 0;

    if (ids.length > MAX_NUM_APPS_PER_LETTER) {
      ids = ids.splice(0, MAX_NUM_APPS_PER_LETTER);
    }

    if (hasMore) {
    	pageNum++;
    	getAppIdsByLetter({
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

// Gets a genre's popular apps
function getPopularAppIds(genreUrl, callback) {
  pconsole.log(genreUrl + ' | popular apps.');

  requestAsync(genreUrl).then(function (html) {
    var $ = cheerio.load(html);
    var ids = [];

    $('#selectedcontent li a').each(function () {
      // example: https://itunes.apple.com/us/app/online-fitting/id600748799?mt=8
      var href = $(this).attr('href');
      var id = href.split('/').pop().slice(2, -5);
      ids.push(id);
    });

    callback(null, ids);
  }, function (err) {
    callback(err);
  });
}

/**
 * Scrape genre app id's
 **/
module.exports.scrapeGenres = function(genreLevelUrls, progressCallback) {
  pconsole.header('Scraping itunes website');
  pconsole.dividor();

  var urls = genreLevelUrls.map(function (url) {
    return {
      isLetterPage: false,
      data: url
    };
  });

  return new bluebird(function (resolve, reject) {
    // get letter pages of all genres
    var letterLevelUrls = getLetterLevel(genreLevelUrls).map(function (options) {
      return {
        isLetterPage: true,
        data: options
      };
    });
    var idGroup = [];

    // concat all urls
    urls = urls.concat(letterLevelUrls);
    //urls = letterLevelUrls;

    // get all ids in series
    async.eachSeries(urls, function (url, callback) {
      var getAppIdsFunc = url.isLetterPage ? getAppIdsByLetter : getPopularAppIds;

      getAppIdsFunc(url.data, function (err, ids) {
        if (err) {
          callback(err);
          return;
        }

        idGroup = idGroup.concat(ids);

        pconsole.log('Number of ids in group: ' + idGroup.length + '/' + ID_GROUP_MAX_NUM);
        pconsole.newLine();

        if (idGroup.length >= ID_GROUP_MAX_NUM) {
          pconsole.dividor();

          // wait for progressCallback to execute
          // and then process the next url
          progressCallback(idGroup).then(function() {
            idGroup = [];
            callback(null);
          }, function(err) {
            callback(err);
          });
        } else {
          callback(null);
        }
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
module.exports.getAllGenreUrls = function(cb) {
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




