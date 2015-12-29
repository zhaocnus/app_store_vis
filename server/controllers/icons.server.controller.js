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
      'GROUP BY `grayscale` ' +
      'ORDER BY `grayscale`';

  conn.query(query)
    .then(function (result) {
      var grayscales = [];
      var resultIndex = 0, resultItem;

      for (var i = 0; i < 256; i += 1) {
        resultItem = result[resultIndex];
        if (resultItem.value === i) {
          grayscales.push(resultItem);
          resultIndex += 1;
        } else {
          grayscales.push({
            value: i,
            count: 0
          });
        }
      }

      return res.status(200).send(grayscales);
    }, function (err) {
      return res.status(400).send({
        message: err
      });
    });
};
