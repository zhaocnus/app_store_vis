'use strict';

/**
 * Module dependencies.
 */
var conn = require('../../data_processing/database/connection');

module.exports.list = function(req, res) {
  var query = 'SELECT * from `genres`';

  conn.query(query).then(function (result) {
    res.status(200).send(result);
  }, function (err) {
    res.status(400).send({
      message: err
    });
  });
};
