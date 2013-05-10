var log = require('../core/log')
  ,  _  = require("underscore")
  , self = require('../core/authorityChecker')
  , group = require('../modules/mod_group');

exports.checkGroup = function(req, res, gid, callback) {
  var userid = req.session.user["_id"];
  
  group.at(gid, function(err, g){
  	if(g.secure == "2"){
  	  callback(err, true);
  	}else{
  	  group.getAllGroupByUid(userid, function(err2, groups){
	  	var gids = [];
	  	_.each(groups,function(g){gids.push(g._id.toString())});
	  	callback(err2, _.contains(gids,gid));
	  }); 
  	}
  });
},

exports.checkMessage = function(req, res, mid, callback) {
  var userid = req.session.user["_id"];

  // TODO:
  var message = require('../modules/mod_message');
  message.at(mid, function(err, msg){
  	if(msg.range == "1"){
  	  callback(err, true);
  	}else{
  	  self.checkGroup(req, res, msg.range, callback);
  	}
  });
};