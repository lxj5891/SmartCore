
"use strict";

var conf    = require("config").app
  , json    = require("./response")
  , errors  = require("./errors")
  , util    = require("./util")
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
 * 未捕获的异常
 */
exports.parseError = function(err, req, res, next) {
  console.log(err);
  json.send(res, new errors.InternalServer());
}

/**
 * Authenticate:
 *  Check the approval status.
 *  The configure of app.js, the handle has been registered.
 */
exports.authenticate = function(req, res, next) {

  log.debug("middleware : authenticate");

  // 不需要验证的页面（TODO: 将list移到配置文件里）
  var safety = true;

  // Static
  safety = safety || req.url.match(/^\/stylesheets/i);
  safety = safety || req.url.match(/^\/javascripts/i);
  safety = safety || req.url.match(/^\/vendor/i);
  safety = safety || req.url.match(/^\/images/i);
  safety = safety || req.url.match(/^\/video/i);

  // Login
  safety = safety || req.url.match(/^\/$/i);
  safety = safety || req.url.match(/^\/simplelogin.*/i);
  safety = safety || req.url.match(/^\/simplelogout.*/i);
  safety = safety || req.url.match(/^\/login.*/i);

  // Register
  safety = safety || req.url.match(/^\/register.*/i);
  safety = safety || req.url.match(/^\/download.*/i);
  safety = safety || req.url.match(/^\/device\/register\.json.*/i);

  if (safety) {
    return next();
  }

  // 确认Session里是否有用户情报
  if (req.session.user) {
//    var user = req.session.user;
//    var code = req.params ? req.params.code: undefined;
//    if(user.type == 0 || user.type == 1) { // Company's general user  and system user
//      var company_code = user.company ? user.company.code : undefined;
//       if(!code || code != company_code) {
//         return next(new errors.InternalServer("没有权限登陆"));
//       }
//    }

    return next();
  }

  // 确认cookie，生成Session情报
  //var cookie = auth.passCookie(req)
  //if (cookie) {
  //  user.at(cookie[0], function(err, result){
  //    if (!err && result) {
  //      req.session.user = result;
  //      return next();  
  //    }
  //  });
  //}

  // TODO: 在API内，不应该有迁移控制，应该拿到客户端实现。和Oauth一起实现
  if (util.isBrowser(req)) {
    return res.redirect("/login");
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
 */
exports.timeout = function(req, res, next) {

  // 上传下载的请求，不设定超时
  var isUpload = false;
  isUpload = isUpload || req.url.match(/^\/file\/download\.json/i);
  isUpload = isUpload || req.url.match(/^\/file\/upload\.json/i);
  isUpload = isUpload || req.url.match(/^\/gridfs\/save\.json/i);
  isUpload = isUpload || req.url.match(/^\/picture\//i);
  isUpload = isUpload || req.url.match(/^\/download\//i);

  if (!isUpload) {
    req.connection.setTimeout(conf.timeout * 1000);
  }

  next();

};
