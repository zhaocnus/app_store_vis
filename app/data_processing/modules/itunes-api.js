/**
 * This module uses itunes api to get app info
 **/

'use strict';

var bluebird = require('bluebird');
var async = require('async');
var pconsole = require('./p-console');
var requestAsync = require('./request-async');
var mainController = require('../controllers/main.controller');

// maximum number of ids allows in an api call
var MAX_NUM_IDS = 50;

// timeout in ms between each request to avoid
// request being rejected by itunes server
var REQUEST_TIMEOUT = 1000;

// Split array into chunks
// Returns a new 2D array
function splitArr(array, chunk) {
  var result = [],
      grounpId = 1,
      tmpArr;

  for (var i = 0; i < array.length; i += chunk) {
    tmpArr = array.slice(i, i + chunk);
    result.push({
      groupId: grounpId, // this is just for stdout
      arr: tmpArr
    });

    grounpId += 1;
  }

  return result;
}

function requestAppDetail(ids, callback) {
  var lookupUrl = 'https://itunes.apple.com/lookup?id=' + ids.arr.join(',');

  requestAsync(lookupUrl).then(function (res) {
    var json;
    try {
      json = JSON.parse(res);
    } catch (err) {
      callback(err);
      return;
    }

    if (json.results && json.results.length > 0) {
      // save apps to database
      mainController.bulkSave(json.results).then(function () {
        pconsole.inline('Group ' + ids.groupId + ' is saved to database.', true);

        // IMPORTANT: Add a delay between each request.
        // Otherwise the request will be rejected by the server
        setTimeout(function () {
          callback(null);
        }, REQUEST_TIMEOUT);
      }, function (err) {
        callback(err);
      });
    } else {
      callback('Itunes request result is not valid.');
    }
  }, function (err) {
    callback(err);
  });
}

module.exports.processApps = function(ids) {
  pconsole.log('Calling itunes api to get app info');

  return new bluebird(function (resolve, reject) {
    // split ids to groups of 50
    var idGroup = splitArr(ids, MAX_NUM_IDS);

    var msg = 'Processing: ' + ids.length + ' ids in ' + idGroup.length + ' groups';
    pconsole.log(msg);

    // Get app detail in group of 50
    async.eachSeries(idGroup, requestAppDetail,
      function (err) {
        if (err) {
          reject(err);
        }

        pconsole.newLine();
        pconsole.log('Complete ' + idGroup.length + ' groups\n');
        resolve();
      });
  });
}