/**
 * sprites controller
 **/

'use strict';
var exec = require('child_process').exec;
var util = require('util');
var uuid = require('node-uuid');
var bluebird = require('bluebird');
var conn = require('../database/connection');
var dbUtil = require('../database/db-util');
var config = require('../../config/config');

// Constants
var TILE_X = config.icon.spriteTileX; // maximum number of images in x-axis
var TILE_Y = config.icon.spriteTileY;; // maximum number of images in y-axis
var TILE_STR = TILE_X + 'x' + TILE_Y;

function addSpriteToDB(filename) {
  var query = util.format(
    'INSERT INTO `sprites` (filename) VALUES (%s)',
    filename
  );

  return conn.query(query);
}

function addSpriteIcons() {

}

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad('0' + str, max) : str;
}

// create spritemap
// Example command:
// montage -mode concatenate -tile 2x2 1.png 2.png 3.png 4.png out.png
// IMPORTANT: the order is x first then y, so out.png will be
// 1 | 2
// 3 | 4
function saveSpriteFile(icons, grayscale) {
  return new bluebird(function (resolve) {
    var input = '',
        output = pad(grayscale, 3) + '--' + uuid.v1() + '.jpg';

    console.log(icons.length);

    // save all inputs as a single string
    icons.forEach(function (icon) {
      input += ' ' + config.icon.tmpPath + '/' + icon.filename;
    });

    var command = util.format(
      'montage -mode concatenate -tile %s %s %s',
      TILE_STR, input,
      config.icon.distPath + '/' + output
    );

    exec(command, function (err) {
      if (err) {
        throw err;
      }

      resolve(output);
    });
  });

}

/**
  icon: {
    iconId: id,
    filename: filename,
    x: sprite.x,
    y: sprite.y
  }
  */
module.exports.addNewSprite = function(icons, grayscale) {
  return saveSpriteFile(icons, grayscale)
    // .then(function (spriteFilename) {
    //   return addSpriteToDB(filename);
    // })
    .then(function (result) {

    });
};