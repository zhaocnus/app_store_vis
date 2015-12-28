'use strict';

// Module dependencies
var spawn = require('child_process').spawn;
var Stream = require('stream');
var request = require('request');
var streamifier = require('streamifier');
var through2 = require('through2');
var pconsole = require('./p-console');

// Constants
var REGEX_HEX = /#[A-Fa-f0-9]{6}/;

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
 * Analyze icon dominant color using imagemagick
 * @param {Stream} streamIn in stream containing the raw image
 * @return {Stream}
 */
function analyzeIcon(streamIn) {
  var args = [
    '-',                  // use stdin
    '-scale', '1x1\!',    // get dominant color
    'txt:-'               // output to stdout
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
module.exports.processIcon = function(img, callback) {
  request(img.url, {encoding: null}, function(err, res, body) {
    if (err || res.statusCode !== 200) {
      var errorMsg = 'Error requesting image. id: ' + img.id;
      pconsole.error(errorMsg);
      return callback(errorMsg);
    }

    // convert body(buffer) to stream
    var streamIn = streamifier.createReadStream(body);

    analyzeIcon(streamIn)
      .pipe( through2(function (chunk, enc, cb) {
        var stdout = chunk.toString(); // imagemagick output
        var hexArr = REGEX_HEX.exec(stdout);
        var hex = hexArr[0].replace('#', '');

        callback(null, { hex: hex });
        cb();
      }) );
  });
};

