/**
 * @file 存取i18n信息的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("../../../index")
  , ctrI18n     = smart.ctrl.i18n
  , context     = smart.framework.context
  , response    = smart.framework.response
  , async       = smart.util.async
  , config      = smart.util.config
  , _           = smart.util.underscore;

/**
 * 获取分类列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.getCategorys = function(req, res){

  var handler = new context().bind(req, res);

  ctrI18n.getCategorys(handler, function(err, result) {

    if(result) { // sort
      result.sort();
    }

    return response.send(res, err, result);

  });
};

/**
 * 获取语言列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.getLangs = function(req, res){

  // TODO langs 应该从Master获得
  var langs = [
      {langCode: "zh", langName: "中文"}
    , {langCode: "en", langName: "英文"}
    , {langCode: "ja", langName: "日文"}
    ];

  var defaultLang = config.app.i18n.lang; // 默认语言
  _.each(langs, function(lang) {
    if(lang.langCode === defaultLang) {
      lang.isDefault = true;
    }
  });

  langs.sort(function(a, b) {
    if(a.isDefault === true) {
      return -1;
    }
    if(b.isDefault === true) {
      return 1;
    }
    return a.langName > b.langName;
  });

  return response.send(res, null, langs);
};

/**
 * 添加词条
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res){

  var handler = new context().bind(req, res);
  var trans = handler.params.trans;

  var tasks = [];

  var langCodes = _.keys(trans);
  _.each(langCodes, function(langCode) {
    var tempHandler = new context().bind(req, res);
    tempHandler.removeParams("trans");
    tempHandler.addParams("lang", langCode);
    tempHandler.addParams("value", trans[langCode]);
    tasks.push(function(done) {
      ctrI18n.add(tempHandler, function(err) {
        done(err);
      });
    });
  });

  async.waterfall(tasks, function(err) {
    return response.send(res, err);
  });

};

/**
 * 获取词条
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.get = function(req, res){

  var handler = new context().bind(req, res);
  handler.addParams("limit", 1);
  handler.addParams("condition", {key: handler.params.key, valid: 1});

  ctrI18n.getList(handler, function(err, result) {

    if(result) {
      result = result[0];
    }

    return response.send(res, err, result);
  });

};

/**
 * 获取词条一览
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res){

  var handler = new context().bind(req, res);
  var params = handler.params;

  var condition = {"valid": 1};
  if(params.category) {
    condition.category = params.category;
  }
  if(params.key) {
    condition.key = { $regex : params.key, $options: "i" };
  }

  handler.addParams("condition", condition);
  handler.addParams("order", "category key");

  ctrI18n.getList(handler, function(err, result) {

    if(result) {
      var langCode = params.lang;
      if(langCode) { // 擦除多余的语言
        _.each(result, function(item) {
          var tempLang = item.lang;
          item.lang = {};
          item.lang[langCode] = tempLang[langCode];
        });
      }
    }

    return response.send(res, err, result);
  });

};









