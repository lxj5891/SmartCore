/**
 * @file 存取访问控制关联信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , conn        = require("../core/connection")
  , schema      = mongo.Schema;

/**
 * 访问控制关联schema
 * @type {schema}
 */
var ACLink = new schema({
    type        : { type: String, description: "类型，1：用户权限关联（main：用户标识，subs：权限标识列表）" }
  , main        : { type: String, description: "主对象标识" }
  , subs        : { type: Array,  description: "子对象标识列表" }
  });

/**
 * 使用定义好的Schema，生成ACLink的model
 * @params {String} code DbCode
 * @returns {*} ACLink model
 */
function model(code) {

  return conn().model(code, "ACLink", ACLink);
}

/**
 * 检查关联是否存在
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subs 子对象标识列表
 * @param {Function} callback(err, boolean) 返回关联是否存在
 */
exports.exist = function(type, main, subs, callback) {

  var linkModel = model();

  linkModel.count({ "type": type, "main": main, "subs" : { $all: subs } }, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 添加关联（关联记录存在，则将给定的子对象追加到列表中；不存在，则插入）
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToAdd 要添加的子对象标识的列表
 * @param {Function} callback(err) 返回异常信息
 */
exports.add = function(type, main, subsToAdd, callback) {

  var linkModel = model();

  linkModel.update({"type": type, "main": main}, { $addToSet: { "subs": { $each: subsToAdd } } },
    { upsert : true }, function(err) {
    return callback(err);
  });
};

/**
 * 更新关联（使用新的的子对象列表完全替换原有的列表）
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToReplace 新的子对象标识的列表
 * @param {Function} callback(err) 返回异常信息
 */
exports.update = function(type, main, subsToReplace, callback) {

  var linkModel = model();

  linkModel.update({"type": type, "main": main}, { "subs": subsToReplace }, function(err) {
    return callback(err);
  });
};

/**
 * 删除关联(并不是删除该条数据，只是从子对象列表中删除对应的子对象)
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToDel 要删除的子对象标识的列表
 * @param {Function} callback(err) 返回异常信息
 */
exports.remove = function(type, main, subsToDel, callback){

  var linkModel = model();

  linkModel.update({"type": type, "main": main}, { $pullAll: { "subs": subsToDel } }, function(err) {
    return callback(err);
  });
};

/**
 * 查询关联
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Function} callback(err, link) 返回关联
 */
exports.get = function(type, main, callback) {

  var linkModel = model();

  linkModel.findOne({"type": type, "main": main}, function(err, result) {
    return callback(err, result);
  });
};







