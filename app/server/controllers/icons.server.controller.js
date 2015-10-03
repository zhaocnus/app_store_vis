'use strict';

/**
 * Module dependencies.
 */


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
