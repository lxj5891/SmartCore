/**
 * @file 国际化（internationalization）
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var util          = require("util")
  , _             = require("underscore")
  , i18n          = require("../controllers/ctrl_i18n")
  , constant      = require("../core/constant")
  , context       = require("../core/context")
  , log           = require("./log")
  , conf          = require("config").app;


// TODO: 支持多种存储方式（文件，数据库）
// TODO: 可以指定参数
// TODO: 动态切换语言
// TODO: 自动翻译（google翻译）词条
// TODO: 缓存到文件


/**
 * 缓存词条
 */
var cache = {};

/**
 * 将所有的词条缓存到内存里
 * @param req
 * @param lang
 * @param category
 * @param callback
 */
function load(handler, lang, category, callback) {

  if (conf && conf.i18n && conf.i18n.cache === "memory") {

    var condition = {
      category: category
    };
    handler.addParams("condition", condition);
    handler.addParams("limit", Number.MAX_VALUE);

    i18n.getList(handler, function(err, result) {
      if (err) {
        return log.error(err, handler);
      }

      _.each(result, function(row) {
        cache[row.key] = row.lang[lang] || row.key;
      });

      log.debug("cached word count : ", cache.length);
      if (callback) {
        callback(cache);
      }
    });
  }
}

function getLang(handler) {

  // 如果session存在，返回用户的语言
  if (handler.user) {
    return handler.lang;
  }

  // 配置文件有缺省的lang定义，则使用它
  if (conf.i18n.lang) {
    return conf.i18n.lang;
  }

  // 返回缺省的语言
  return constant.DEFAULT_LANG;
}

exports.init = function(req, category, callback) {

  if (_.isEmpty(cache) === true) {

    var handler = new context().bind(req);
    load(handler, getLang(handler), category, callback);
  }
};

exports.update = function(key, phrase) {

  cache[key] = phrase;
};

exports.reload = function(req, category, callback) {

  var handler = new context().bind(req);
  load(handler, getLang(handler), category, callback);
};

exports.__ = function() {

  if (_.isEmpty(arguments)) {
    return "";
  }

  var phrase = cache[arguments[0]] || arguments[0];
  if (arguments.length > 1) {
    arguments[0] = phrase;
    return util.format.apply(this, arguments);
  }

  return phrase;
};
