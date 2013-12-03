/**
 * @file 存取Master信息的api
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var ctrlMaster    = smart.ctrl.master
  , context     = smart.framework.context
  , response    = smart.framework.response;

/**
 * 添加Master
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlMaster.add(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });
};

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