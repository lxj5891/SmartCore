/**
 * @file 存取分类的Controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var constant    = require("../constant")
  , errors      = require("../errors")
  , log         = require("../log")
  , masterUtil  = require("../master")
  , master      = require("../models/mod_master.js");

/**
 * 添加分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回追加的分类结果
 */
exports.add = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , newMaster = params.master
    , masterType = newMaster.masterType
    , masterCode = newMaster.masterCode;

  log.debug("begin: add master.", uid);
  log.debug("master: ", master);
  log.debug("master Type: ", masterType);
  log.debug("master Code: ", masterCode);

  var date = new Date();
  newMaster.valid = constant.VALID;
  newMaster.createAt = date;
  newMaster.createBy = uid;
  newMaster.updateAt = date;
  newMaster.updateBy = uid;

  handler.addParams("masterType", masterType);
  handler.addParams("masterCode", masterCode);
  handler.addParams("cache", false);

  master.getByKey(masterType,masterCode, function(err, result) {

    if (err) {
      log.error(err,uid);
      callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      if (result) {
        callback(err, result);
      } else {
        master.add(newMaster, function(err, result) {
          if (err) {
            log.error(err, uid);
            callback(new errors.InternalServer(__("js.ctr.common.system.error")));
          } else {
            log.debug(result, uid);
            log.debug("finished: add master.", uid);
            callback(err, result);
          }
        });
      }
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
 * 获取分类
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回分类
 */
exports.getByKey = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , masterType = params.masterType
    , masterCode = params.masterCode
    , cache = params.cache || false; // true:从缓存读取,没有时从DB中读取,并写入缓存.false:从DB读取

  log.debug("begin: get master.", uid);
  log.debug("master Type: ", masterType);
  log.debug("master Code: ", masterCode);
  // TODO boolean时 有bug，值不能显示
  log.debug("master cache: "  + cache, uid);

  if (cache === true) {
    var masterContent = masterUtil.get(masterType, masterCode);
    if (masterContent) {
      callback(masterContent);
    } else {

      // 缓冲中没有,从DB中读取,并且写入缓存.
      master.getByKey(masterType, masterCode, function(err, result) {
        if (err) {
          log.error(err, uid);
          callback(new errors.InternalServer(__("js.ctr.common.system.error")));
        } else {
          log.debug(result, uid);

          //包装返回结果,DB中没有时,返回undefined.
          if (result) {
            var tempKey = result.masterType + result.masterCode;
            var tempCache = {
                trsKey : result.masterTrsKey
              , fieldSet : result.fieldSet
              };
            masterUtil.update(tempKey, tempCache);
            log.debug("finished: get master by key.", uid);
            callback(err, tempCache);
          } else {
            log.debug("finished: get master by key.", uid);
            callback(undefined);
          }
        }
      });
    }
  } else {

    // 缓冲中没有,或者从DB中读取时,执行
    master.getByKey(masterType, masterCode, function(err, result) {
      if (err) {
        log.error(err, uid);
        callback(new errors.InternalServer(__("js.ctr.common.system.error")));
      } else {
        log.debug(result, uid);
        if (result) {
          var tempCache = {
              trsKey : result.masterTrsKey
            , fieldSet : result.fieldSet
            };
          log.debug("finished: get master by key.", uid);
          callback(err, tempCache);
        } else {
          log.debug("finished: get master by key.", uid);
          callback(undefined);
        }
      }
    });
  }
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

  master.update(masterId, updateMaster,  function(err, result) {
    if (err) {
      log.error(err, uid);
      callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: update master.", uid);

      if (result) {
        var masterContent = masterUtil.get(result.masterType, result.masterCode);

        // 如果缓存中有时,更新缓存.
        if (masterContent) {
          var tempKey = result.masterType + result.masterCode;
          var tempCache = {
              trsKey : result.masterTrsKey
            , fieldSet : result.fieldSet
            };
          masterUtil.update(tempKey, tempCache);
        }
      }
      callback(err, result);
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
      callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: remove master.", uid);
      if (result) {
        var masterContent = masterUtil.get(result.masterType, result.masterCode);

        // 如果缓存中有时,更新缓存.
        if (masterContent) {
          var tempKey = result.masterType + result.masterCode;
          masterUtil.delete(tempKey);
        }
      }
      callback(err, result);
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