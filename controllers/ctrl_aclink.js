/**
 * @file 存取访问控制关联信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var errors      = require("../core/errors")
  , log         = require("../core/log")
  , modAclink   = require("../modules/mod_aclink");

/**
 * 检查关联是否存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回关联是否存在
 */
exports.exist = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subs = params.subs;

  modAclink.exist(code, type, main, subs, function(err, exist) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, exist);
  });
};

/**
 * 添加关联（关联记录存在，则将给定的子对象追加到列表中；不存在，则插入）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回添加的关联
 */
exports.add = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToAdd = params.subsToAdd;

  modAclink.add(code, type, main, subsToAdd, function(err, result) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    log.info("finished: add aclink " + result._id + " .", handler.uid);
    log.audit("finished: add aclink " + result._id + " .", handler.uid);

    return callback(err, result);
  });
};

/**
 * 更新关联（使用新的的子对象列表完全替换原有的列表）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回更新后的关联
 */
exports.update = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToReplace = params.subsToReplace;

  modAclink.update(code, type, main, subsToReplace, function(err, result) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {

      log.info("finished: update aclink " + result._id + " .", handler.uid);
      log.audit("finished: update aclink " + result._id + " .", handler.uid);

      return callback(err, result);
    }

    return callback(new errors.NotFound(__("aclink.error.notExist")));
  });
};

/**
 * 删除关联(并不是删除该条数据，只是从子对象列表中删除对应的子对象)
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回更新后的关联
 */
exports.remove = function(handler, callback){

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToDel = params.subsToDel;

  modAclink.remove(code, type, main, subsToDel, function(err, result) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {

      log.info("finished: remove aclink " + result._id + " .", handler.uid);
      log.audit("finished: remove aclink " + result._id + " .", handler.uid);

      return callback(err, result);
    }

    return callback(new errors.NotFound(__("aclink.error.notExist")));
  });
};

/**
 * 查询关联
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回关联
 */
exports.get = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var main = params.main;

  modAclink.get(code, type, main, function(err, result) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      return callback(err, result);
    }

    return callback(new errors.NotFound(__("aclink.error.notExist")));
  });
};

/**
 * 检查用户是否有某种权限
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回是否有某种权限
 */
exports.hasPermission = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var type = params.type;
  var uid = params.uid;
  var permission = params.permission;

  modAclink.exist(code, type, uid, [permission], function(err, exist) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, exist);
  });
};







