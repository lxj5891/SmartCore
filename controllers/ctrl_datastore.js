
var async = require('async')
  , datastore = require('../modules/mod_datastore')
  , injections = "../injections/";

/**
 *
 */
exports.create = function(uid, appid, document, callback) {

  var self = this, application = require(injections + appid)
    , current = new Date();

  document.createat = current;
  document.createby = uid;
  document.editat = current;
  document.editby = uid;

  // 前处理
  var befor = function(next) {

    var args = [];
    args.push(document);
    args.push(next);
    application.befor.apply(self, args);
  };

  // 生成数据
  var create = function(document, next) {
    datastore.create(application.collection, document, function(err, result){
      next(err, result);
    });
  };

  // 后处理
  var after = function(result, next) {

    var args = [];
    args.push(result);
    args.push(next);
    application.after.apply(self, args);
  };

  var tasks = [];
  tasks.push(befor);
  tasks.push(create);
  tasks.push(after);
  async.waterfall(tasks, function(err, result){
    callback(err, result);
  });
};

/**
 *
 */
exports.update = function(uid, appid, condition, document, callback) {

  var self = this, application = require(injections + appid);

  document.editat = new Date();
  document.editby = uid;

  // 前处理
  var befor = function(next) {

    var args = [];
    args.push(condition);
    args.push(document);
    args.push(next);
    application.befor.apply(self, args);
  };

  // 生成数据
  var update = function(condition, document, next) {
    datastore.update(application.collection, condition, document, function(err, result){
      next(err, result);
    });
  };

  // 后处理
  var after = function(result, next) {

    var args = [];
    args.push(result);
    args.push(next);
    application.after.apply(self, args);
  };

  var tasks = [];
  tasks.push(befor);
  tasks.push(update);
  tasks.push(after);
  async.waterfall(tasks, function(err, result){
    callback(err, result);
  });

};

/**
 *
 */
exports.updateById = function(uid, appid, dataid, document, callback) {

  var self = this, application = require(injections + appid);

  document.editat = new Date();
  document.editby = uid;

  // 前处理
  var befor = function(next) {

    var args = [];
    args.push(dataid);
    args.push(document);
    args.push(next);
    application.befor.apply(self, args);
  };

  // 生成数据
  var update = function(condition, document, next) {
    datastore.updateById(application.collection, dataid, document, function(err, result){
      next(err, result);
    });
  };

  // 后处理
  var after = function(result, next) {

    var args = [];
    args.push(result);
    args.push(next);
    application.after.apply(self, args);
  };

  var tasks = [];
  tasks.push(befor);
  tasks.push(update);
  tasks.push(after);
  async.waterfall(tasks, function(err, result){
    callback(err, result);
  });

};

/**
 *
 */
exports.find = function(uid, appid, params, start, limit, callback) {

  var self = this, application = require(injections + appid);

  // 前处理
  var befor = function(next) {

    var args = [];
    args.push(params);
    args.push(start);
    args.push(limit);
    args.push(next);
    application.befor.apply(self, args);
  };

  // 生成数据
  var find = function(condition, start, limit, next) {
    datastore.find(application.collection, condition, start, limit, function(err, result){
      next(err, result);
    });
  };

  // 后处理
  var after = function(result, next) {

    var args = [];
    args.push(result);
    args.push(next);
    application.after.apply(self, args);
  };

  var tasks = [];
  tasks.push(befor);
  tasks.push(find);
  tasks.push(after);
  async.waterfall(tasks, function(err, result){
    callback(err, result);
  });

};

/**
 *
 */
exports.findById = function(uid, appid, dataid, callback) {

  var self = this, application = require(injections + appid);

  // 前处理
  var befor = function(next) {

    var args = [];
    args.push(dataid);
    args.push(next);
    application.befor.apply(self, args);
  };

  // 生成数据
  var find = function(dataid, next) {
    datastore.findById(application.collection, dataid, next, function(err, result){
      next(err, result);
    });
  };

  // 后处理
  var after = function(result, next) {

    var args = [];
    args.push(result);
    args.push(next);
    application.after.apply(self, args);
  };

  var tasks = [];
  tasks.push(befor);
  tasks.push(find);
  tasks.push(after);
  async.waterfall(tasks, function(err, result){
    callback(err, result);
  });

};
