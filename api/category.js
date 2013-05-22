
var category = require('../controllers/ctrl_category')
  , json = require("../core/json");

/**
 *
 */
exports.create = function(req_, res_) {

  var uid = req_.session.user._id
    , project = req_.body.project
    , group = req_.body.group
    , parent = req_.body.parent
    , description = req_.body.description
    , items = req_.body.items;

  category.create(uid, project, group, parent, description, items, function(err, result){
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
exports.addItem = function(req_, res_) {

  var uid = req_.session.user._id
    , categoryid = req_.body.categoryid
    , items = req_.body.items;

  category.addItem(uid, categoryid, items, function(err, result){
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

  var start = req_.query.start
    , limit = req_.query.limit
    , project = req_.query.project
    , group = req_.query.group;

  category.find(project, group, start, limit, function(err, result){
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

  var categoryid = req_.query.id;

  category.findById(categoryid, function(err, result){
    if (err) {
      return res_.send(json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });

};

