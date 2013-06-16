/**
 * API APNs
 * Copyright (c) 2012 Author Name dd_dai
 */

var json = require("../core/json")
  , apn = require("../controllers/ctrl_apn");
  
/**
 * 更新设备的token
 */
exports.update = function (req_, res_) {

  var uid = req_.session.user._id
    , tocken = req_.body.devicetoken 
    , owner = req_.body.deviceowner;

  apn.update(uid, tocken, owner, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });
};

/**
 * 获取设备的token
 */
exports.find = function (req_, res_) {

  apn.find(req_.query.deviceowner, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });
};

exports.clear = function (req_, res_) {

  apn.remove(req_.body.devicetoken, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });
};
