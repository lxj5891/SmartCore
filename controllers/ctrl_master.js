/**
 * @file 存取分类的Controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var constant    = require("../core/constant")
  , errors      = require("../core/errors")
  , log         = require("../core/log")
  , master      = require("../modules/mod_master.js");


/**
 * 添加分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回追加的分类结果
 */
exports.add = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , newMaster = params.master;

  log.debug("begin: add master.", uid);
  log.debug("master: ", master);

  var date = new Date();
  newMaster.valid = constant.VALID;
  newMaster.createAt = date;
  newMaster.createBy = uid;
  newMaster.updateAt = date;
  newMaster.updateBy = uid;

  //TODO check没有追加 masterCode,fieldCode,masterType不能重复？

  master.add(newMaster, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: add master.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 获取分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回分类
 */
exports.get = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , masterId = params.masterId;

  log.debug("begin: get master.", uid);
  log.debug("master id: ", masterId);

  master.get(masterId, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: get master.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 获取分类一栏
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回分类一栏
 */
exports.getList = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , start = params.start
    , limit = params.limit
    , condition = params.condition
    , order = params.order;

  log.debug("begin: get master list.", uid);
  log.debug("start: ", start);
  log.debug("limit: ", limit);
  log.debug("condition: ", condition);
  log.debug("order: ", order);

  // 获取一览
  master.getList(condition, start, limit, order, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    }
    log.debug("result:" + result, uid);
    log.debug("finished: get master list.", uid);
    return callback(err,  result);
  });
};

/**
 * 更新分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回更新的分类
 */
exports.update = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , masterId = params.masterId
    , updateMaster = params.updateMaster;

  updateMaster.updateAt = new Date();
  updateMaster.updateBy = uid;

  log.debug("begin: update master.", uid);
  log.debug("master Id: ", masterId);
  log.debug("update master: ", updateMaster);

  //TODO check没有追加 masterCode,fieldCode,masterType不能重复？

  master.update(masterId, updateMaster,  function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: update master.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 删除分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回删除后的分类
 */
exports.remove = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , masterId = params.masterId
    , updateMaster = params.updateMaster;

  masterId.updateAt = new Date();
  updateMaster.updateBy = uid;

  log.debug("begin: remove master.", uid);
  log.debug("master Id: ", masterId);
  log.debug("update master: ", updateMaster);

  master.remove(masterId, updateMaster, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: remove master.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 获取分类件数
 * @param {Object} handler 上下文对象
 * @param {function} callback 返回分类件数
 */
exports.total = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , condition = params.condition;

  log.debug("begin: total.", uid);
  log.debug("condition: ", condition);

  master.total(condition, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: total.", uid);
      return callback(err, result);
    }
  });
};