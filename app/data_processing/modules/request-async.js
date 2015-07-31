'use strict';

var request = require('request');
var Bluebird = require('bluebird');

// async request of a page's html
function requestAsync(url) {
  return new Bluebird(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (error) {
        throw error;
      }

      if (response && response.statusCode === 200) {
        resolve(body);
      } else {
        reject('requestAsync: request failed : ' + url);
      }
    });
  });
}

module.exports = requestAsync;