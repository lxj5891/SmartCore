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
// TODO: 缓存到文件（词条的版本管理）

/**
 * 缓存词条
 */
var cache = {};

/**
 * 将所有的词条缓存到内存里
 * @param {Object} req 请求
 * @param {String} lang 语言
 * @param {Function} callback 缓存的内容
 */
function load(handler, lang, callback) {

  console.log(lang);
  if (conf && conf.i18n && conf.i18n.cache === "memory") {

    var condition = {
      category: conf.i18n.category || constant.DEFAULT_I18N_CATEGORY
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

      log.debug("cached word count : " + Object.keys(cache).length, undefined);
      if (callback) {
        callback(cache);
      }
    });
  } else {
    callback(undefined);
  }
}

/**
 * 判断当前用户需要使用的语言
 * @param {Object} handler 上下文对象
 * @returns {String} 语言
 */
function getLang(handler) {

  // 如果session存在，返回用户的语言
  if (handler.user) {
    return handler.lang;
  }

  // 配置文件有缺省的lang定义，则使用它
  if (conf && conf.i18n && conf.i18n.lang) {
    return conf.i18n.lang;
  }

  // 返回缺省的语言
  return constant.DEFAULT_I18N_LANG;
}

/**
 * 初始化
 * 从数据库读取所有内容，并加载到内存
 * @param {Object} req 请求
 * @param {Function} callback 返回缓存的内容
 */
exports.init = function(req, callback) {

  if (_.isEmpty(cache) === true) {

    var handler = new context().bind(req);
    var lang = getLang(handler);

    log.info("initialoze i18n", undefined);
    log.info("i18n lang: " + lang, undefined);

    // 从数据库读取内容，并加载到内存
    load(handler, lang, callback);

    // 注册全局变量
    global.__ = exports.__;
  }
};

/**
 * 检查词语是否被缓存
 * @returns {Boolean} true的时候，说明已经被缓存
 */
exports.isCached = function() {
  return !_.isEmpty(cache);
};

/**
 * 更新一个词条
 * @param {String} key 词条key
 * @param {String} phrase 翻译
 */
exports.update = function(key, phrase) {

  log.debug(util.format("i18n cache updated. key:%s", ""), undefined);
  cache[key] = phrase;
};

/**
 * 从新加载缓存的所有词条
 * @param {Object} req 请求
 * @param {Function} callback 返回缓存的内容
 */
exports.reload = function(req, callback) {

  var handler = new context().bind(req);
  load(handler, getLang(handler), callback);
};

/**
 * 获取词条的内容，可以通过添加参数替换内容，格式如下
 *  %s - String.
 *  %d - Number (both integer and float).
 *  %j - JSON.
 *  %  - Single percent sign ('%'). This does not consume an argument.
 *  引自node的util.format
 * @returns {String} 词条的内容
 */
exports.__ = function() {

  if (_.isEmpty(arguments)) {
    return "";
  }

  var phrase = cache[arguments[0]] || arguments[0];
  if (arguments.length > 1) {
    arguments[0] = phrase;
    console.log(cache);
    return util.format.apply(this, arguments);
  }

  return phrase;
};
