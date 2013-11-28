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

  var langs = [
      {langCode: "zh", langName: "中文"}
    , {langCode: "en", langName: "英文"}
    , {langCode: "ja", langName: "日文"}
    ];

  langs.sort(function(a, b) {
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