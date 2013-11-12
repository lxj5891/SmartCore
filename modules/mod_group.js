/**
 * @file 存取组信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("smartcore")
  , mongo       = smart.util.mongoose
  , conn        = require("./connection")
  , schema      = mongo.Schema
  , mixed       = schema.Types.Mixed;

/**
 * 组schema
 * @type {schema}
 */
var Group = new schema({
    name          : { type : String, description: "组名" }
  , parent        : { type : String, description: "父组标识" }
  , description   : { type : String, description: "描述" }
  , type          : { type : String, description: "类型, 1:部门（公司组织结构）, 2:组（自由创建）, 3:职位组" }
  , public        : { type : String, description: "公开性, 1:私密，2:公开" }
  , owner         : { type : Array,  description: "经理一览" }
  , extend        : { type : mixed,  description: "扩展属性" }
  , valid         : { type : Number, description: "删除 0:无效 1:有效", default:1 }
  , createat      : { type : Date,   description: "创建时间" }
  , createby      : { type : String, description: "创建者" }
  , editat        : { type : Date,   description: "最终修改时间" }
  , editby        : { type : String, description: "最终修改者" }
  });

/**
 * 使用定义好的Schema，生成Group的model
 * @returns {Object} Group model
 */
function model() {

  return conn().model("Group", Group);
}

/**
 * 创建组
 * @param {Object} group 组对象
 * @param {Function} callback(err, group) 回调函数，返回新加入的组
 */
exports.add = function(group, callback) {

  var modGroup = model();

  new modGroup(group).save(function(err, result){
    callback(err, result);
  });
};

/**
 * 根据组标识查询组
 * @param {String} gid 组标识
 * @param {String} fields 查询的字段，例如："id name parent type"
 * @param {Function} callback(err, group) 回调函数，返回组信息
 */
exports.get = function (gid, fields, callback) {

  var modGroup = model();

  modGroup.findOne({"_id": gid, "valid": 1}, fields, function (err, result) {
    callback(err, result);
  });
};

/**
 * 查询符合条件的组数目
 * @param {Object} condition 查询条件
 * @param {Function} callback(err, count) 回调函数，返回组数目
 */
exports.total = function (condition, callback) {

  var modGroup = model();

  modGroup.count(condition, function (err, count) {
    callback(err, count);
  });
};

/**
 * 根据指定条件查询组
 * @param {Object} condition 查询条件
 * @param {String} fields 查询的字段，例如："id name parent type"
 * @param {Number} skip 跳过的文书数，默认为0
 * @param {Number} limit 返回的文书的上限数目，默认为20
 * @param {String} order 排序，例如："name -type"
 * @param {Function} callback(err, groups) 回调函数，返回组列表
 */
exports.getList = function (condition, fields, skip, limit, order, callback) {

  var modGroup = model();

  modGroup.find(condition)
    .select(fields)
    .skip(skip || 0)
    .limit(limit || 20)
    .sort(order)
    .exec(function (err, result) {
      callback(err, result);
    });
};

/**
 * 根据组标识更新组
 * @param {String} gid 组标识
 * @param {Object} newGroup 更新命令
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
exports.update = function (gid, newGroup, callback) {

  var modGroup = model();

  modGroup.findOneAndUpdate({"_id": gid, "valid": 1}, newGroup, function (err, result) {
    callback(err, result);
  });
};