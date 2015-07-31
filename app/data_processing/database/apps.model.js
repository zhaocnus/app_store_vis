/**
 * apps model
 *
 **/

'use strict';

var util = require('util');
var connection = require('./connection');
var dbUtil = require('./db-util');

// order of COLUMNS_ARR and COLUMNS_STR needs to match
var COLUMNS_ARR = [{
  name: 'trackId',
  field: 'track_id'
}, {
  name: 'trackName',
  field: 'track_name'
}, {
  name: 'artworkUrl60',
  field: 'artwork_url60'
}];

var COLUMNS_STR = '(`track_id`, `track_name`, `artwork_url60`)';

function processAppDetail(appDetail) {
  var row = [];

  COLUMNS_ARR.forEach(function (value) {
    var key = value.name;

    if (appDetail.hasOwnProperty(key)) {
      row.push(appDetail[key]);
    } else {
      row.push(null);
    }
  });

  return row;
}


// appDetailArr is in group of 50 OR less
function bulkSave(appDetailArr) {
  var rows = [];

  appDetailArr.forEach(function(appDetail) {
    rows.push( processAppDetail(appDetail) );
  });

  var query = util.format('INSERT INTO `apps` %s VALUES %s ON DUPLICATE KEY UPDATE %s',
    COLUMNS_STR,
    connection.pool.escape(rows),
    dbUtil.getBulkDuplicateUpdateStr(COLUMNS_ARR)
  );

  return connection.query(query);
}

module.exports = {
  bulkSave: bulkSave
};