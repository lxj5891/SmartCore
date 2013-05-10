/**
 * Routes
 * Copyright (c) 2012 Author Name li
 */

var api = require('./api');

exports.guidingApi = function(app){
  api.guiding(app);
}
