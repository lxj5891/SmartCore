var amqp = require('../core/amqp')
  , util = require("../core/util")
  , json = require("../core/json")
  , notification = require('../controllers/ctrl_notification');



exports.read = function(req_, res_) {

  var nids = req_.body.nids;
  var uids = req_.body.uids || [req_.session.user._id];
  var code = req_.session.user.companycode;
  

  notification.read(code, nids, uids, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      // console.log("read");
      // console.log(result);
      amqp.notice({
          _id: uids
        , content:"1"
      });

      return res_.send(json.dataSchema(result));
    }
  });

};


exports.getList = function(req_, res_) {
  var code = req_.session.user.companycode;
  var param = {
    "start":req_.query.start ,
    "limit":req_.query.limit ,
    "type":req_.query.type ,
    "uid": req_.query.uid || req_.session.user._id
  };

  notification.getList(code, param, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

exports.getUnreadList = function(req_, res_) {
  var code = req_.session.user.companycode;
  var param = {
    "start":req_.query.start ,
    "limit":req_.query.limit ,
    "type":req_.query.type ,
    "uid": req_.query.uid || req_.session.user._id ,
    "unread":true
  };

  notification.getList(code, param, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};