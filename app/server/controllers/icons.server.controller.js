'use strict';

/**
 * Module dependencies.
 */
var conn = require('../../data_processing/database/connection');

module.exports.read = function(req, res) {
  console.log(req.originalUrl);

  return res.status(200).send({
    message: 'success'
  });
};

module.exports.list = function(req, res) {
  console.log(req.originalUrl);
  console.log(req.query);

  return res.status(200).send([1, 2]);
};

module.exports.findByGrayscale = function(req, res) {
  var query =
      'SELECT `grayscale` AS `value`, count(`grayscale`) AS `count` ' +
      'FROM `apps` ' +
      'WHERE `grayscale` IS NOT NULL ' +
      'GROUP BY `grayscale`';

  conn.query(query)
    .then(function (result) {
      return res.status(200).send(result);
    }, function (err) {
      return res.status(400).send({
        message: err
      });
    });
};
