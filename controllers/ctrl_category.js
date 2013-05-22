
var error = require("../core/errors")
  , category = require('../modules/mod_category')
  , default_project = "all"
  , default_group = "all";


exports.detail = function(args,callback_){

  category.findById(args, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback_(err, result);
  });

};

exports.add = function(obj, callback_){
  var current = new Date();
  var category_ =obj.category;
  category_.createat = current;
  category_.editat = current;
  category_.editby = category_.createby;
  category.create(category_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};
exports.edit = function(obj, callback_){
  category.update(obj._id,obj.category, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  }); 
}

exports.del = function(obj, callback_){
  category.del(obj._id, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  }); 
}

exports.create = function(uid, project, group, parent, description, items, callback) {

  var current = new Date();
  var data = {
      "project": project || default_project
    , "group": group || default_group
    , "parent": parent
    , "description": description
    , "items": items
    , "createat": current
    , "createby": uid
    , "editat": current
    , "editby": uid
    };

  category.create(data, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback(err, result);
  });
};

/*
 * 添加分类的某一个项目
 * 数据格式如下，可以是数组，可以是一个项目
 [{
    name: 
    value:
    description:
  }]
*/
exports.addItem = function(uid, categoryid, items, callback) {

  var data = [];
  if (items instanceof Array) {
    data = items;
  } else {
    data.push(items);
  }

  category.addItem(categoryid, items, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback(err, result);
  });

};

exports.list = function(start,limit,callback) {
  category.find({}, start, limit, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback(err, result);
  });
};

exports.find = function(project, group, start, limit, callback) {

  var condition = {};
  if (project) {
    condition.project = project;
  }

  if (group) {
    condition.group = group;
  }

  category.find(condition, start, limit, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback(err, result);
  });
};

exports.findById = function(categoryid, callback) {
  category.findById(categoryid, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    callback(err, result);
  });
};
