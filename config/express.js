'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var morgan = require('morgan');

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

  // Showing stack errors
  app.set('showStackError', true);

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  var clientPath = path.resolve(__dirname, '../client'),
      buildPath = path.resolve(__dirname, '../build');
  app.use(express.static(clientPath));
  app.use(express.static(buildPath));

  //if (process.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  //}

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