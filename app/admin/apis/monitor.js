/**
 * @file Monitor信息的api
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var ctrlMaster  = smart.ctrl.master
  , context     = smart.framework.context
  , response    = smart.framework.response;

/**
 * 获取Master
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.get = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlMaster.get(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });
};

/**
 * 获取Master一览
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlMaster.getList(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });
};