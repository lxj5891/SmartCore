/**
 * @file 国际化module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , _           = require("underscore")
  , constant    = require("../constant")
  , conn        = require("../connection")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed;

/**
 * 国际化schema
 * @type {schema}
 */
var I18n = new schema({
    category      : { type: String, description: "分类", default:constant.DEFAULT_I18N_CATEGORY }
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
 * @param {String} code 公司code
 * @param {Object} condition 条件
 * @param {Number} start 数据开始位置
 * @param {Number} limit 数据件数
 * @param {Number} order 排序
 * @param {Function} callback 回调函数，返回词条一览
 */
exports.getList = function(code, condition, start, limit, order, callback){
  var i18n = model(code);
  i18n.find(condition)
    .skip(start || constant.MOD_DEFAULT_START)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 获取一个词条
 * @param {String} code 公司code
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
 * 添加词条, 如果已经存在则更新
 * @param {String} code 公司code
 * @param {Object} word 新的词条对象
 * @param {Function} callback 回调函数，number：更新件数，update:true更新
 */
exports.add = function(code, word, callback){

  var I18n = model(code);

  exports.get(code, word.key, function(err, result) {

    if (result) {

      // $set操作符没起作用，所以重新拷贝了一份（可以优化）
      var newLang = result.lang;
      _.each(word.lang, function(val, key) {
        newLang[key] = val;
      });

      var newWord = {
        lang: newLang
      , updateAt: word.updateAt
      , updateBy: word.updateBy
      };

      if (word.category) {
        newWord.category = word.category;
      }

      I18n.findByIdAndUpdate(result._id, newWord, function(err, result) {
        return callback(err, result);
      });

    } else {
      new I18n(word).save(function(err, result) {
        return callback(err, result);
      });
    }
  });
};

/**
 * 获取分类列表
 * @param {String} code 公司code
 * @param {Function} callback 回调函数，返回分类一览
 */
exports.getCategorys = function(code, callback){

  var I18n = model(code);

  I18n.distinct("category", {valid: 1}, function(err, result) {
    return callback(err, result);
  });
};