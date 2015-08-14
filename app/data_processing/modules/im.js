'use strict';


var spawn = require('child_process').spawn;
var Stream = require('stream');
var fs = require('fs');
var http = require('http');
var util = require('util');
var path = require('path');
var async = require('async');
var bluebird = require('bluebird');
var request = require('request');

// (https://gist.github.com/arian/3266825)
/**
 * Processes stream using imagemagick
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
 * Creates image thumbnail
 * @param {Stream} streamIn in stream containing the raw image
 * @return {Stream}
 */
function createThumbnail(streamIn) {
  var args = [
    '-',                        // use stdin
    '-thumbnail', '16x16\!',    // create thumbnail
    '-'                         // output to stdout
  ];

  return processStream(streamIn, args);
}

/**
 * Processes single image
 * @param {object} image {url: string, id: number}
 */
function processImage(image, cb) {
  console.log(image.url);
  var streamIn = request
    .get(image.url)
    .on('error', function(err) {
      pconsole.error(image.url);
      throw err;
    });

  var filename = './tmp/icons/' + image.id + path.extname(image.url);
  var stream = createThumbnail(streamIn)
    .pipe(fs.createWriteStream(filename));

  stream
    .on('finish', function () {
      cb();
    })
    .on('error', function (err) {
      throw err;
    });
}

module.exports.bulkProcess = function (images, cb) {
  return new bluebird(function (resolve) {
    async.map(images, processImage, function (err) {
      if (err) {
        throw err;
      }

      resolve();
    });
  });
};

