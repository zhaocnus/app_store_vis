'use strict';

module.exports = function(app) {
	var iconsController = require('../../server/controllers/icons');

	// single icon
	app.route('/api/icons/:iconId')
		.get(iconsController.read);

	// list of icons
	app.route('/api/icons')
		.get(iconsController.list);

  // find by grayscale
  app.route('/api/icons_grayscale')
    .get(iconsController.findByGrayscale);
};
