/**
 * @file 存取组信息的module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart     = require("smartcore")
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
  , owner         : { type : Array, description: "经理一览" }
  , extend        : { type : schema.Types.Mixed, description: "扩展属性" }
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
 * 查询符合条件的组数目
 * @param <Object> condition 查询条件
 * @param <Function> callback(err, count) 回调函数，返回组数目
 */
exports.count = function (condition, callback) {

  var Group = model();

  Group.count(condition, function (err, count) {
    callback(err, count);
  });
};