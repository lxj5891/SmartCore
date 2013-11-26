/**
 * @file 存取用户信息的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("../../../index")
  , ctrlGroup   = smart.ctrl.group
  , context     = smart.framework.context
  , response    = smart.framework.response;

/**
 * 添加组
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlGroup.add(handler, function(err, result) {

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

  ctrlGroup.update(handler, function(err, result) {

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

  ctrlGroup.remove(handler, function(err, result) {

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

  ctrlGroup.get(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 查询组下的用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getUsersInGroup = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlGroup.getUsersInGroup(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};

/**
 * 查询组下的下位组织
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getSubGroups = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlGroup.getSubGroups(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    return response.send(res, err, result);
  });

};



