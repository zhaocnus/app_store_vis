/**
 * Module to create spritemap using icons' grayscale value
 * REF
 * [Combine multiple images using ImageMagick](http://superuser.com/a/290679)
 */

'use strict';

// Module dependencies
var util = require('util');
var exec = require('child_process').exec;
var async = require('async');
var bluebird = require('bluebird');
var pconsole = require('./p-console');
var uuid = require('node-uuid');
var config = require('../../config/config');
var appsController = require('../controllers/apps.controller');
var spritesController = require('../controllers/sprites.controller');

// Constants
var TILE_X = config.icon.spriteTileX;
var TILE_STR = TILE_X + 'x' + config.icon.spriteTileY;


// create spritemap
// Example command:
// montage -mode concatenate -tile 2x2 1.png 2.png 3.png 4.png out.png
// IMPORTANT: the order is x first then y, so out.png will be
// 1 | 2
// 3 | 4
function saveSpriteFile(icons, spriteFilename) {
  return new bluebird(function (resolve) {
    var input = '';

    // save all inputs as a single string
    icons.forEach(function (icon) {
      input += ' ' + config.icon.tmpPath + '/' + icon.filename;
    });

    var command = util.format(
      'montage -mode concatenate -tile %s %s %s',
      TILE_STR, input,
      config.icon.distPath + '/' + spriteFilename
    );

    exec(command, function (err) {
      if (err) {
        throw err;
      }

      resolve();
    });
  });
}

/**
 * Create sprite from icons
 */
module.exports.createSpriteFromIcons = function(icons) {
  // get icons x,y coordinates
  icons.forEach(function (icon, index) {
    icon.x = index % TILE_X;
    icon.y = Math.floor(index / TILE_X);
  });

  var spriteId;
  return spritesController.addSprite()
    .then(function (result) {
      spriteId = result.spriteId;
      return saveSpriteFile(icons, result.spriteFilename);
    })
    .then(function () {
      return spritesController.addSpriteIcons(spriteId, icons);
    });
};
