'use strict';
    // ------------------------------------------------------
    // Downloading row 223701 - 223800
    // Analyzing images
    // Saving image info
    // ------------------------------------------------------
    // Downloading row 223801 - 223900


/**
 * Module to create sprite image using icons' grasyscale value
 */

// REF
// Combine multiple images using ImageMagick : (http://superuser.com/a/290679)

// Module dependencies
var exec = require('child_process').exec;
var path = require('path');
var util = require('util');
var async = require('async');
var pconsole = require('./p-console');
var conn = require('../database/connection');
var config = require('../../config/config');

var appsController = require('../controllers/apps.controller');

// Constants
var ICON_SRC = config.icon.tmpPath; // tmp dir to save icons
var ICON_DIST = config.icon.distPath; // base dir to save icons

var grayscaleArr = [];
var MAX_Y = 10; // maximum number of images in y-axis

// constants
var ROWS_PER_QUERY = 256;


function initArr() {
  for (var i = 0; i < 256; i++) {
    grayscaleArr.push({
      files: '',
      count: 0,
      overallIndex: 0,
      queries: []
    });
  }
}

// add zeros in front of numbers
// limited to 3 digits
// Use recursive function to support more digits
// REF: (http://stackoverflow.com/a/6466243/2259286)
function pad(num) {
  if (num < 10) {
    return '00' + num;
  } else if (num < 100) {
    return '0' + num;
  } else {
    return num.toString();
  }
}

// create spritemap
// Example command:
// montage -mode concatenate -tile 1x 281656475.png 281736535.png 281747159.png out.png
function createSprite(input, output, cb) {
  var command = 'montage -mode concatenate -tile 1x ' +
      input + ' ' + output;

  exec(command, function (err) {
    if (err) {
      throw err;
    }

    cb();
  });
}

// update icon info to database
function updateDatabase(queries, cb) {
  conn.execTransaction(queries)
    .then(function() {
      console.log(queries.length);
      cb();
    }, function(err) {
      console.log(queries.length);
      throw err;
    });
}

function processSingleRow(row, cb) {
  var filename = row.filename,
      trackId = row.track_id,
      grayscale = row.grayscale;

  var arrItem = grayscaleArr[grayscale],
      spriteName = pad(grayscale) + '-' + arrItem.overallIndex + '.jpg',
      query = util.format(
        'UPDATE apps ' +
        'SET sprite_name = \'%s\', index_in_sprite = %d ' +
        'WHERE track_id = %d',
        spriteName, arrItem.count, trackId);

  arrItem.queries.push(query);
  arrItem.files += path.join(ICON_SRC, filename) + ' ';

  if (arrItem.count < MAX_Y - 1) {
    // continue new icon in same sprite
    arrItem.count ++;
    cb();
  } else {
    // reach MAX_Y, save sprite
    async.series([
      function (callback) {
        var spritePath = path.join(ICON_DIST, spriteName);
        createSprite(arrItem.files, spritePath, callback);
      },
      function (callback) {
        updateDatabase(arrItem.queries, callback);
      }
    ], function (err) {
      console.log('Done');
      if (err) {
        throw err;
      }

      pconsole.log('Saved sprite : ' + spriteName);

      // new sprite
      arrItem.count = 0;
      arrItem.queries = [];
      arrItem.files = '';
      arrItem.overallIndex ++;
      cb();
    });
  }
}
/**
 * Process rows by LIMIT and OFFSET
 **/
function processRows(offset, cb) {



}

/**
 * Process all rows
 **/
function processAll(numRows, cb) {
  var offsets = [];

  // debug
  numRows = 160000;

  // 161601
  for (var offset = 0; offset < numRows; offset += ROWS_PER_QUERY) {
    offsets.push(offset);
  }

  async.eachSeries(offsets, processRows, function (err) {
    if (err) {
      return cb(err);
    }

    resolve();
  });
}


/**
 * bulk process images array
 * @param {array} images array of images. {id: number, filename: string}
 * @return {Promise}
 */
module.exports.run = function () {
  initArr();

  async.waterfall([
    appsController.getNumRows,
    processAll
  ], function (err) {
    if (err) {
      throw err;
    }

    pconsole.log('All Done.');
  });
};
