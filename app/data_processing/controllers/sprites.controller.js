/**
 * sprites controller
 **/

'use strict';
var util = require('util');
var conn = require('../database/connection');
var dbUtil = require('../database/db-util');
var bluebird = require('bluebird');


module.exports.addSprite = function() {
  return new bluebird(function (resolve) {
    var query = 'INSERT INTO `sprites` (id) VALUES (NULL)';

    var id, filename;

    conn.query(query)
      .then(function (result) {
        id = result.insertId;
        filename = id + '.jpg';

        query = util.format(
          'UPDATE `sprites` ' +
          'SET filename = "%s" ' +
          'WHERE id = %d',
          filename, id
        );

        return conn.query(query);
      })
      .then(function () {
        resolve({
          spriteId: id,
          spriteFilename: filename
        });
      }, function (err) {
        throw err;
      })
  });
};

module.exports.addSpriteIcons = function(spriteId, icons) {
  var query =
    'INSERT INTO `sprites_icons` ' +
    '(sprite_id, icon_id, x, y) VALUES';

  var max = icons.length - 1;
  icons.forEach(function (icon, index) {
    query += util.format(
      '(%d, %d, %d, %d)',
      spriteId, icon.track_id, icon.x, icon.y
    );

    if (index < max) {
      query += ',';
    }
  });

  return conn.query(query);
};
