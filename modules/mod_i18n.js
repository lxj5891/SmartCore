/**
 * @file 国际化module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , constant    = require("../core/constant")
  , conn        = require("../core/connection")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed;

/**
 * 国际化schema
 * @type {schema}
 */
var I18n = new schema({
    category      : { type: String, description: "分类" }
  , key           : { type: String, description: "词条key" }
  , lang          : { type: Mixed,  description: "翻译结果" }
  , valid         : { type: Number, description: "删除 0:无效 1:有效", default:constant.VALID }
  , createAt      : { type: Date,   description: "创建时间" }
  , createBy      : { type: String, description: "创建者" }
  , updateAt      : { type: Date,   description: "最终修改时间" }
  , updateBy      : { type: String, description: "最终修改者" }
  });

/**
 * 使用定义好的Schema，生成I18n的model
 * @returns {Object} i18n model
 */
function model(code) {
  return conn.model(code, constant.MODULES_NAME_I18N, I18n);
}

/**
 * 获取词条一览
 * @param {Object} condition 条件
 * @param {Number} start 数据开始位置
 * @param {Number} limit 数据件数
 * @param {Number} order 排序
 * @param {Function} callback 回调函数，返回词条一览
 */
exports.getList = function(code, condition, start, limit, order, callback){

  var comp = model(code);

  comp.find(condition)
    .skip(start || constant.MOD_DEFAULT_START)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 获取一个词条
 * @param {String} key 词条的key
 * @param {Function} callback 回调函数，返回词条对象
 */
exports.get = function(code, key, callback) {

  var i18n = model(code);

  i18n.findOne({ key: key }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 添加词条，如果存在则更新
 * @param {Object} keyword 新的公司对象
 * @param {Function} callback 回调函数，number：更新件数，update:true更新
 */
exports.add = function(code, keyword, callback){

  var i18n = model(code);

  i18n.update({ key: keyword.key }, keyword, { upsert: true }, function(err, number, update) {
    return callback(err, number, update.updatedExisting);
  });
};
