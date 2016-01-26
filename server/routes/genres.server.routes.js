'use strict';

var genresController = require('../../server/controllers/genres');

module.exports = function(app) {
  app.route('/api/genres')
    .get(genresController.list);

  app.route('/api/genres/:genreId')
    .get(genresController.readGenreSummary);

  // Finish by binding the genre middleware
  app.param('genreId', genresController.genreById);
};
