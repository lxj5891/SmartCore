/**
 * @file 存取访问控制关联信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , conn        = require("../core/connection")
  , constant    = require("../core/constant")
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

  return conn.model(code, constant.MODULES_NAME_ACLINK, ACLink);
}

/**
 * 检查关联是否存在
 * @param {String} code 公司code
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subs 子对象标识列表
 * @param {Function} callback 返回关联是否存在
 */
exports.exist = function(code, type, main, subs, callback) {

  var link = model(code);

  link.count({ "type": type, "main": main, "subs" : { $all: subs } }, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 添加关联（关联记录存在，则将给定的子对象追加到列表中；不存在，则插入）
 * @param {String} code 公司code
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToAdd 要添加的子对象标识的列表
 * @param {Function} callback 返回添加的关联
 */
exports.add = function(code, type, main, subsToAdd, callback) {

  var link = model(code);

  link.findOneAndUpdate({"type": type, "main": main},
    { $addToSet: { "subs": { $each: subsToAdd } } }, { upsert : true }, function(err, doc) {

    return callback(err, doc);
  });
};

/**
 * 更新关联（使用新的的子对象列表完全替换原有的列表）
 * @param {String} code 公司code
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToReplace 新的子对象标识的列表
 * @param {Function} callback 返回更新后的关联
 */
exports.update = function(code, type, main, subsToReplace, callback) {

  var link = model(code);

  link.findOneAndUpdate({"type": type, "main": main}, { "subs": subsToReplace }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 删除关联(并不是删除该条数据，只是从子对象列表中删除对应的子对象)
 * @param {String} code 公司code
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Array} subsToDel 要删除的子对象标识的列表
 * @param {Function} callback 返回更新后的关联
 */
exports.remove = function(code, type, main, subsToDel, callback){

  var link = model(code);

  link.findOneAndUpdate({"type": type, "main": main}, { $pullAll: { "subs": subsToDel } }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 查询关联
 * @param {String} code 公司code
 * @param {String} type 类型
 * @param {String} main 主对象标识
 * @param {Function} callback 返回关联
 */
exports.get = function(code, type, main, callback) {

  var link = model(code);

  link.findOne({"type": type, "main": main}, function(err, result) {
    return callback(err, result);
  });
};







