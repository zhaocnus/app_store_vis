'use strict';

// Module dependencies
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var util = require('util');
var async = require('async');
var bluebird = require('bluebird');
var pconsole = require('./p-console');

// Constants
var ICON_BASE = require('../../config/config').icon.tmpPath; // base dir to save icons
var REGEX_RGB = /[\(][0-9]{1,3},[0-9]{1,3},[0-9]{1,3}/;
var REGEX_HEX = /#[A-Fa-f0-9]{6}/;

/**
 * gets image rgb and grayscale values
 * REF (http://stackoverflow.com/a/17619494/2259286)
 * example of infoStr:
 * # ImageMagick pixel enumeration: 1,1,255,srgba
 * 0,0: (125,67,64,1)  #7D4340  srgba(125,67,64,1)
 */
function analyzeColor(infoStr) {
  var rgbStr = REGEX_RGB.exec(infoStr),
      hexStr = REGEX_HEX.exec(infoStr);

  if (!rgbStr || !hexStr) {
    return null;
  }

  var rgb = rgbStr[0].replace('(', '').split(','),
      hex = hexStr[0].replace('#', '');
  console.log(rgb, hex);

  return {
    hex: hex,
    grayscale: 255
  };
}

/**
 * analyze downloaded image
 */
function analyze(img, callback) {
  // img could be undefined if the image url is not valid
  if (!img) {
    callback();
  }

  var filepath =  path.join(ICON_BASE, img.filename),
      command = util.format('convert %s -scale 1x1\! txt:-', filepath);

  // execute imagemagick command to analyze image rgb and gray scale value
  exec(command, function (err, stdout, stderr) {
    if (err) {
      pconsole.log('Image analyzer error: id: ' + img.id);
      return callback();
    }

    var color = analyzeColor(stdout);
    callback(null, {
      id: img.id,
      hex: color.hex,
      grayscale: color.grayscale
    });
  });
}

/**
 * bulk process images array
 * @param {array} images array of images. {id: number, filename: string}
 * @return {Promise}
 */
module.exports.bulkAnalyze = function (images) {
  return new bluebird(function (resolve) {
    async.map(images, analyze, function (err, results) {
      if (err) {
        throw err;
      }

      resolve(results);
    });
  });
};

