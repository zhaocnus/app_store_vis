'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var morgan = require('morgan');
var favicon = require('serve-favicon');

var config = require('./config');

/**
 * Initialize the Express application
 */
module.exports.init = function () {
  // Initialize express app
  var app = express();

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // TODO(favicon doesn't work)
  app.use(
    favicon(path.join(config.server.root, 'client', 'favicon.ico'))
  );

  // Showing stack errors
  app.set('showStackError', true);

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  var clientPath = path.resolve(__dirname, '../client');
  app.use(express.static(clientPath));

  // logger
  if (process.NODE_ENV !== 'production') {
    app.use(morgan('tiny'));
  }

  // Globbing routing files
  config.getGlobbedFiles('./server/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // serve single page app index.html
  var indexFile = process.env.NODE_ENV === 'development' ?
      path.join(clientPath, 'index.html') :
      path.join(buildPath, 'dist', 'index.html');
  app.use(function (req, res) {
    res.sendFile(indexFile);
  });

  return app;
};