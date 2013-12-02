/**
 * @file 国际化controller
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var check       = require("validator").check
  , errors      = require("../errors")
  , i18nUtil    = require("../i18n")
  , log         = require("../log")
  , i18n        = require("../models/mod_i18n");

/**
 * 添加词条
 * 语言可以明确指定，如果没有指定则使用Session中得用户信息的lang
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的词条
 */
exports.add = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , lang = params.lang || handler.lang;

  log.debug("begin: add keyword.", uid);
  log.debug("category: " + params.category, uid);
  log.debug("key: " + params.key, uid);
  log.debug("value: " + params.value, uid);
  log.debug("lang: " + lang, uid);

  try {

    // 词条不能为空
    check(params.key, __("js.ctr.check.company.name.min")).notEmpty();
  } catch (err) {

    log.error(err.message, uid);
    return callback(new errors.BadRequest(err.message));
  }

  var word = {};
  word.key = params.key;
  word.createAt = params.createAt || new Date();
  word.createBy = params.creator || uid;
  word.updateAt = word.createAt;
  word.updateBy = params.updater || uid;

  // 语言
  word.lang = {};
  word.lang[lang] = params.value;

  // 指定分类
  if (params.category) {
    word.category = params.category;
  }

  i18n.add(handler.code, word, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    }

    // 更新缓存
    i18nUtil.update(params.key, params.value);

    log.debug("finished: add keyword.", uid);
    return callback(err, result._doc);
  });
};

/**
 * 获取词条一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果一览
 */
exports.getList = function(handler ,callback) {

  var params = handler.params
    , uid = handler.uid
    , start = params.start
    , limit = params.limit
    , condition = params.condition
    , order = params.order;

  i18n.getList(handler.code, condition, start, limit, order, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, result);
  });
};

/**
 * 获取词条
 * 语言可以明确指定，如果没有指定则使用Session中得用户信息的lang
 * 如果该key的内容不存在，则返回key本身
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果
 */
exports.get = function(handler ,callback) {

  var params = handler.params
    , uid = handler.uid
    , lang = params.lang || handler.lang;

  log.debug("begin: get keyword.", uid);

  i18n.get(handler.code, params.key, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(err));
    }

    log.debug("finished: get keyword.", uid);
    return callback(err, result ? result.lang[lang] : params.key);
  });
};

/**
 * 获取分类列表
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回分类列表
 */
exports.getCategorys = function(handler ,callback) {

  var uid = handler.uid;

  log.debug("begin: get categorys.", uid);

  i18n.getCategorys(handler.code, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(err));
    }

    log.debug("finished: get categorys.", uid);
    return callback(err, result);
  });
};