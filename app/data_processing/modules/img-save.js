'use strict';

/**
 * Module to save image info to db
 */

// Module dependencies
var util = require('util');
var async = require('async');
var bluebird = require('bluebird');
var conn = require('../database/connection');
var pconsole = require('./p-console');

function prepareQueries(images) {
  var queries = [];
  images.forEach(function (img) {
    if (!img) {
      return;
    }

    var query = util.format(
      'UPDATE `apps` ' +
      'SET `grayscale` = %d, `hex` = \'%s\', `filename` = \'%s\' ' +
      'WHERE `track_id` = %d' ,
      img.grayscale, img.hex, img.filename, img.id);

    queries.push(query);
  });

  return queries;
}



/**
 * bulk save images
 * @param {array} images array of images.
 * {id: number, hex: color.hex, grayscale: number, filename: string}
 * @return {Promise}
 */
module.exports.bulkSave = function (images) {
  var queries = prepareQueries(images);
  return conn.execTransaction(queries);
};

