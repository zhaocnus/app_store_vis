/**
 * Module to create spritemap using icons' grayscale value
 * REF
 * [Combine multiple images using ImageMagick](http://superuser.com/a/290679)
 */

'use strict';

// Module dependencies
var async = require('async');
var bluebird = require('bluebird');
var pconsole = require('./p-console');
var config = require('../../config/config');
var appsController = require('../controllers/apps.controller');
var spritesController = require('../controllers/sprites.controller');

// Constants
var MAX_X = config.icon.spriteTileX - 1; // maximum number of images in x-axis
var MAX_Y = config.icon.spriteTileY - 1; // maximum number of images in y-axis

// sprite array, index is grayscale
var spriteArr = initArr();

/**
 * init grayscaleArr
 */
function initArr() {
  var arr = [];
  for (var i = 0; i < 256; i++) {
    arr.push({
      x: 0, // x index
      y: 0, // y index
      icons: [] // icons array
    });
  }

  return arr;
}

function addIcon(row, cb) {
  var id = row.track_id,
      grayscale = row.grayscale,
      filename = row.filename;

  if (grayscale === null || !filename) {
    console.log('Icon not valid. track_id: ' + id);
    return cb();
  }

  var sprite = spriteArr[grayscale];

  // add icon to sprite
  sprite.icons.push({
    iconId: id,
    filename: filename,
    x: sprite.x,
    y: sprite.y
  });

  // update sprite for next icon
  var isSync = true;
  if (sprite.x >= MAX_X && sprite.y >= MAX_Y) {
    // reach max x and max y, save current sprite
    spritesController.addNewSprite(sprite.icons, grayscale)
      .then(function () {
        cb();
      }, function (err) {
        throw err;
      });

    // start from a new sprite
    sprite.x = 0;
    sprite.y = 0;
    sprite.icons = [];

    isSync = false;
  } else if (sprite.x >= MAX_X) {
    // reach max x, start a new row
    sprite.x = 0;
    sprite.y += 1;
  } else {
    sprite.x += 1;
  }

  if (isSync) {
    cb();
  }
}

/**
 * Adds new icons to spritemap
 * iconRows: rows of apps table
 */
module.exports.addIcons = function(rows) {
  return new bluebird(function (resolve) {
    async.eachSeries(rows, addIcon, function (err) {
      if (err) {
        throw err;
      }

      resolve();
    });
  });
};
