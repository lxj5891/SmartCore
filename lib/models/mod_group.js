/**
 * @file 存取组信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , schema      = mongo.Schema
  , mixed       = schema.Types.Mixed
  , conn        = require("../connection")
  , constant    = require("../constant");

/**
 * 组schema
 * @type {schema}
 */
var Group = new schema({
    name          : { type : String, description: "组名" }
  , parent        : { type : String, description: "父组标识" }
  , description   : { type : String, description: "描述" }
  , type          : { type : String, description: "类型, 1:部门（公司组织结构）, 2:组（自由创建）, 3:职位组" }
  , visibility    : { type : String, description: "可见性, 1:私密，2:公开" }
  , owners        : { type : Array,  description: "经理一览" }
  , extend        : { type : mixed,  description: "扩展属性" }
  , valid         : { type : Number, description: "删除 0:无效 1:有效", default:1 }
  , createAt      : { type : Date,   description: "创建时间" }
  , createBy      : { type : String, description: "创建者" }
  , updateAt      : { type : Date,   description: "最终修改时间" }
  , updateBy      : { type : String, description: "最终修改者" }
  });

/**
 * 使用定义好的Schema，生成Group的model
 * @param {String} code 公司code
 * @returns {Object} Group model
 */
function model(code) {

  return conn.model(code, constant.MODULES_NAME_GROUP, Group);
}

/**
 * 创建组
 * @param {String} code 公司code
 * @param {Object} group 组对象
 * @param {Function} callback 回调函数，返回新创建的组
 */
exports.add = function(code, group, callback) {

  var Group = model(code);

  new Group(group).save(function(err, result){
    callback(err, result);
  });
};

/**
 * 根据组标识查询组
 * @param {String} code 公司code
 * @param {String} gid 组标识
 * @param {Function} callback 回调函数，返回组信息
 */
exports.get = function (code, gid, callback) {

  var group = model(code);

  group.findById(gid, function (err, result) {
    callback(err, result);
  });
};

/**
 * 查询符合条件的组数目
 * @param {String} code 公司code
 * @param {Object} condition 查询条件
 * @param {Function} callback 回调函数，返回组数目
 */
exports.total = function (code, condition, callback) {

  var group = model(code);

  group.count(condition, function (err, count) {
    callback(err, count);
  });
};

/**
 * 根据指定条件查询组
 * @param {String} code 公司code
 * @param {Object} condition 查询条件
 * @param {Number} skip 跳过的文书数，默认为0
 * @param {Number} limit 返回的文书的上限数目，默认为20
 * @param {String} order 排序
 * @param {Function} callback 回调函数，返回组列表
 */
exports.getList = function (code, condition, skip, limit, order, callback) {

  var group = model(code);

  group.find(condition)
    .skip(skip || constant.MOD_DEFAULT_START)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function (err, result) {
      callback(err, result);
    });
};

/**
 * 根据组标识更新组
 * @param {String} code 公司code
 * @param {String} gid 组标识
 * @param {Object} newGroup 更新用的组对象
 * @param {Function} callback 回调函数，返回更新后的组
 */
exports.update = function (code, gid, newGroup, callback) {

  var group = model(code);

  group.findByIdAndUpdate(gid, newGroup, function (err, result) {
    callback(err, result);
  });
};