'use strict';

require('./config/init')();

var config = require('./config/config');

// Init the express application
var app = require('./config/express').init();
app.listen(config.server.port, function () {
  console.log('server started on port : ' + config.server.port);
});

