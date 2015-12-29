'use strict';

module.exports = function(app) {
	// var iconsController = require('../../server/controllers/icons');

	// // single icon
	// app.route('/api/genres/:iconId')
	// 	.get(iconsController.read);

	// // list of icons
	// app.route('/api/icons')
	// 	.get(iconsController.list);

 //  // find by grayscale
 //  app.route('/api/icons_grayscale')
 //    .get(iconsController.findByGrayscale);


  var genresController = require('../../server/controllers/genres');

  app.route('/api/genres')
    .get(genresController.list);

  app.route('/api/genres/:genreId')
    .get(genresController.readGenreSummary);

  // Finish by binding the genre middleware
  app.param('genreId', genresController.genreById);
};
