'use strict';

module.exports = {
  server: {
    port: 3000
  },
  db: {
    host : 'localhost',
    database : 'app_store_vis_final',
    user : 'root',
    password : 'root',
    connectionLimit : 10
  },
  icon: {
    tmpPath: './tmp/icons',
    distPath: './public/icons',
    spriteTileX: 40,
    spriteTileY: 40
  }
};
