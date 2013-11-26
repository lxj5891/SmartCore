/**
 * @file 存取用户信息的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("../../../index")
  , ctrlUser    = smart.ctrl.user
  , context     = smart.framework.context
  , response    = smart.framework.response;

/**
 * 添加用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.add(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 更新用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.update = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.update(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 删除用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.remove = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.remove(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 查询用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.get = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.get(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 查询用户列表
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.getList(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};





