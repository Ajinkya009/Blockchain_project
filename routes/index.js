'use strict';

var errors = require('../util/error');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/user', require('./user'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api)/*').get(errors[404]);

};
