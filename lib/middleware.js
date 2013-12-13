/**
 * @file 应用程序过滤器，在处理响应之前做一些处理（如校验是否登录，设定csrftoken等）
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _       = require("underscore")
  , conf    = require("config").app
  , errors  = require("./errors")
  , i18n    = require("./i18n")
  , log     = require("./log");

/**
 * 注册ejs用全局国际化函数
 * 缓存数据库中的词条（仅在没有缓存过时，才进行）
 * @param {Object} req 请求
 * @param {Object} res 响应
 * @param {Function} next 是否执行后续操作的回调方法
 */
exports.lang = function(req, res, next) {

  // 已经被缓存，则直接返回
  if (i18n.isCached()) {
    res.locals.i = function() {
      return i18n.__.apply(req, arguments);
    };

    next();
  } else {

    // 初始化
    i18n.init(req, function() {

      res.locals.i = function() {
        return i18n.__.apply(req, arguments);
      };

      next();
    });
  }
};

/**
 * Authenticate:
 *  Check the approval status.
 *  The configure of app.js, the handle has been registered.
 * @param {Object} req 请求
 * @param {Object} res 响应
 * @param {Function} next 是否执行后续操作的回调方法
 * @returns {*} 无
 */
exports.authenticate = function(req, res, next) {

  log.debug("middleware : authenticate");

  var safety = false;

  // URL是否与不需要认证的路径匹配（配置文件中定义）
  _.each(conf.ignoreAuth, function(path) {
    var regexPath = new RegExp(path, "i");
    safety = safety || !_.isNull(req.url.match(regexPath));
  });

  // 不做检测的URL
  if (safety) {
    return next();
  }

  // 确认Session里是否有用户情报
  if (req.session.user) {
    return next();
  }

  // 401 Unauthorized
  throw new errors.Unauthorized("Not logged in");
};

/**
 * Csrftoken:
 *  To implant csrf token in the Request.
 *  The configure of app.js, the handle has been registered.
 */
exports.csrftoken = function(req, res, next) {

  log.debug("middleware : csrftoken");

  // 设定token的全局变量
  res.setHeader("csrftoken", req.session._csrf);
  res.locals({"csrftoken": req.session._csrf});
  next();
};

/**
 * 设定客户端请求超时
 * @param {Object} req 请求
 * @param {Object} res 响应
 * @param {Function} next 是否执行后续操作的回调方法
 */
exports.timeout = function(req, res, next) {

  var ignoreTimeout = false;

  // 判断URL是否属于非超时范围
  _.each(conf.ignoreTimeout, function(path) {
    var regexPath = new RegExp(path, "i");
    ignoreTimeout = ignoreTimeout || !_.isNull(req.url.match(regexPath));
  });

  if (!ignoreTimeout) {
    req.connection.setTimeout(conf.timeout * 1000);
  }

  next();
};
