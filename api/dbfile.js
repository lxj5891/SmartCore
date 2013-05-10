
var dbfile = require('../controllers/ctrl_dbfile');

exports.image = function(req, res) {

  dbfile.image(req, res, function(err, doc, info){
    res.send(doc);
  });

}
