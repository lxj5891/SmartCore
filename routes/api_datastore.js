
var datastore = require('../api/datastore');

exports.guiding = function(app){

  app.post('/app/turnover/add.json', function(req, res){

    req.appid = "turnover_create";
    datastore.create(req, res);

  });

  app.get('/app/turnover/list.json', function(req, res){

    req.appid = "turnover_list";
    datastore.find(req, res);

  });

};
