/**
 * @file 国际化controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var i18n        = smart.ctrl.i18n
  , log         = smart.framework.log
  , _           = smart.util.underscore;


/**
 * 获取词条一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果一览
 */
exports.getList = function(handler ,callback) {


  i18n.getList(handler, function(err, result) {

    var params = handler.params
      , uid    = params.uid;

    log.debug("begin: getList keyword", uid);

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    var i18nData = [];

    _.each(result, function(data) {

      var tmpI18nData = {
          category: data.category
        , key: data.key
        };

      _.each(data.lang, function(val, key) {
        tmpI18nData[key] = val;
      });

      i18nData.push(tmpI18nData);
    });

    log.debug("finish: getList keyword", uid);

    return callback(err, i18nData);
  });
};

/**
 * 更新词条
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果一览
 */
exports.update = function(handler ,callback) {

  var params = handler.params
    , uid    = params.uid;

  log.debug("begin: update keyword", uid);

  // 请求的参数 key，修改后的值，语种lang
  var paramLang = handler.params.lang;

  // 追加词条时，特殊处理（在画面只输入key，或者分类时）
  if ("key" === paramLang) {
    handler.params.key = handler.params.value;
    handler.params.lang = "";
  }

  if ("category" === paramLang) {
    handler.params.category = handler.params.value;
    handler.params.lang = "";
  }

  i18n.add(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    // 返回唯一的语种值
    var rtnResult = "";
    if ("key" === paramLang) {
      rtnResult = result.key;
    } else if ("category" === paramLang) {
      rtnResult = result.category;
    } else {
      _.each(result.lang, function(val, key) {
        if (key === paramLang) {
          rtnResult = val;
        }
      });
    }

    log.debug("finished: update keyword", uid);

    return callback(err, rtnResult);
  });
};