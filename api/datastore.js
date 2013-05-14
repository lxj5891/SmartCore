
var datastore = require('../controllers/ctrl_datastore')
  , json = require("../core/json");

/**
 *
 */
exports.create = function(req_, res_) {

  var uid = req_.session.user._id
    , appid = req_.appid
    , document = req_.body;

  datastore.create(uid, appid, document, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });

};

/**
 * 
 */
exports.update = function(req_, res_) {

  var uid = req_.session.user._id
    , appid = req_.appid
    , dataid = req_.query.id
    , document = req_.body;

  //uid, appname, condition, document, callback
  datastore.updateById(uid, appid, dataid, document, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });

};

/**
 * 
 */
exports.find = function(req_, res_) {

  var uid = req_.session.user._id
    , appid = req_.appid
    , start = req_.query.start
    , limit = req_.query.limit
    , params = req_.query;

  datastore.find(uid, appid, params, start, limit, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });

};

/**
 * 
 */
exports.findById = function(req_, res_) {

  var uid = req_.session.user._id
    , appid = req_.query.appid
    , start = req_.query.start
    , limit = req_.query.limit
    , condition = req_.body;

  datastore.find(uid, appid, condition, start, limit, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });

};

