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
    , owner = req_.body.deviceowner
    , code = req_.session.user.companycode;

  apn.update(code, uid, tocken, owner, function(err, result){
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

  var code = req_.session.user.companycode
    , deviceowner = req_.query.deviceowner;

  apn.find(deviceowner, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });
};

exports.clear = function (req_, res_) {

  var code = req_.session.user.companycode
    , devicetoken = req_.query.deviceowner;

  apn.remove(devicetoken, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });
};
