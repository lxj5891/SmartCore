/**
 * @file 国际化api
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var ctrI18n     = require("../controllers/ctrl_i18n")
  , context     = smart.framework.context
  , response    = smart.framework.response;

/**
 * 获取词条一览
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res){

  var handler = new context().bind(req, res);

  ctrI18n.getList(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 更新词条
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.update = function(req, res) {

  var handler = new context().bind(req, res);

  ctrI18n.update(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });
};








