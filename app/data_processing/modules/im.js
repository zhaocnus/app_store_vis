'use strict';

// Module dependencies
var spawn = require('child_process').spawn;
var Stream = require('stream');
var fs = require('fs');
var http = require('http');
var util = require('util');
var path = require('path');
var async = require('async');
var bluebird = require('bluebird');
var request = require('request');
var streamifier = require('streamifier');
var pconsole = require('./p-console');

// Constants
var ICON_BASE = './tmp/icons'; // base dir to save icons

/**
 * Processes stream using imagemagick
 * REF:
 * (https://gist.github.com/arian/3266825)
 * @param {Stream} streamIn in stream containing the raw image
 * @param {array} args augments for convert command
 * @return {Stream}
 */
function processStream(streamIn, args) {
  var command = 'convert',
      proc = spawn(command, args),
      stream = new Stream();

  proc.stderr.on('data', stream.emit.bind(stream, 'error'));
  proc.stdout.on('data', stream.emit.bind(stream, 'data'));
  proc.stdout.on('end', stream.emit.bind(stream, 'end'));
  proc.on('error', stream.emit.bind(stream, 'error'));

  streamIn.pipe(proc.stdin);

  return stream;
}

/**
 * Creates image thumbnail using imagemagick
 * @param {Stream} streamIn in stream containing the raw image
 * @return {Stream}
 */
function createThumbnail(streamIn) {
  var args = [
    '-',                        // use stdin
    '-thumbnail', '32x32\!',    // create thumbnail
    '-'                         // output to stdout
  ];

  return processStream(streamIn, args);
}

/**
 * process remote image
 * REF:
 * (http://stackoverflow.com/a/12751657/2259286)
 * (http://stackoverflow.com/a/14145853/2259286)
 * @param {object} img {url: string, id: number}
 */
function processImg(img, callback) {
  request(img.url, {encoding: null}, function(err, res, body) {
    if (err || res.statusCode !== 200) {
      pconsole.error('Error requesting image. id: ' + img.id);
      return callback(); // proceed to next image
    }

    // prepare path name
    var contentType = res.headers['content-type'],
        filename = img.id + '.' + contentType.replace('image/', ''),
        filepath = path.join(ICON_BASE, filename);

        // convert body(buffer) to stream
    var streamIn = streamifier.createReadStream(body);

    createThumbnail(streamIn)
      .on('error', function (err) {
        pconsole.error('Error processing image. id: ' + img.id);
        return callback(); // proceed to next image
      })
      .pipe(fs.createWriteStream(filepath))
      .on('finish', function () {
        callback();
      })
      .on('error', function (err) {
        pconsole.error('Error saving image. id: ' + img.id);
        return callback(); // proceed to next image
      });
  });
}

module.exports.bulkProcess = function (images) {
  return new bluebird(function (resolve) {
    async.map(images, processImg, function (err) {
      if (err) {
        throw err;
      }

      resolve();
    });
  });
};

