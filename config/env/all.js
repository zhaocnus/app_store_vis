'use strict';

var path = require('path');

module.exports = {
  server: {
    port: 3000,
    root: path.resolve(__dirname, '../../')
  },
  db: {
    host : 'localhost',
    database : 'app_store_vis_final',
    user : 'root',
    password : 'root',
    connectionLimit : 10
  }
};
