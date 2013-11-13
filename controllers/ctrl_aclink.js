/**
 * @file 存取访问控制关联信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var modAclink   = require("../modules/mod_aclink");

/**
 * 检查关联是否存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) 返回关联是否存在
 */
exports.exist = function(handler, callback) {

  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subs = params.subs;

  modAclink.exist(type, main, subs, callback);
};

/**
 * 添加关联（关联记录存在，则将给定的子对象追加到列表中；不存在，则插入）
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 返回异常信息
 */
exports.add = function(handler, callback) {

  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToAdd = params.subsToAdd;

  modAclink.add(type, main, subsToAdd, callback);
};

/**
 * 更新关联（使用新的的子对象列表完全替换原有的列表）
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 返回异常信息
 */
exports.update = function(handler, callback) {

  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToReplace = params.subsToReplace;

  modAclink.update(type, main, subsToReplace, callback);
};

/**
 * 删除关联(并不是删除该条数据，只是从子对象列表中删除对应的子对象)
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 返回异常信息
 */
exports.remove = function(handler, callback){

  var params = handler.params;

  var type = params.type;
  var main = params.main;
  var subsToDel = params.subsToDel;

  modAclink.remove(type, main, subsToDel, callback);
};

/**
 * 查询关联
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, link) 返回关联
 */
exports.get = function(handler, callback) {

  var params = handler.params;

  var type = params.type;
  var main = params.main;

  modAclink.get(type, main, callback);
};

/**
 * 检查用户是否有某种权限
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) 返回是否有某种权限
 */
exports.hasPermission = function(handler, callback) {

  var params = handler.params;

  var type = params.type;
  var uid = params.uid;
  var permission = params.permission;

  modAclink.exist(type, uid, [permission], callback);
};







