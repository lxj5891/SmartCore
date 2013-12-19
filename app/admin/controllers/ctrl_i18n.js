/**
 * @file 国际化controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _           = smart.util.underscore
  , i18n        = smart.ctrl.i18n;


/**
 * 获取词条一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果一览
 */
exports.getList = function(handler ,callback) {


  i18n.getList(handler, function(err, result) {
    if (err) {
//      log.error(err, uid);
//      return callback(new errors.InternalServer(err));
      return false;
    }
    var i18nData = [];

    _.each(result, function(data) {

      var tmpI18nData = {
          category: data.category
        , key: data.key
        , zh: "lang"
        , ja: "lang"
        , en: "lang"
        };
      i18nData.push(tmpI18nData);
    });
    return callback(err, i18nData);
  });
};

/**
 * 获取词条一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回翻译结果一览
 */
exports.update = function(handler ,callback) {

  console.log(handler);
  i18n.add(handler, function(err, result) {
    if (err) {
//      log.error(err, uid);
//      return callback(new errors.InternalServer(err));
      return false;
    }

    return callback(err, result);
  });
};