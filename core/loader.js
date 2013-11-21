/**
 * @file Smart核心服务的初始化
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var path        = require("path")
  , conf        = require("config")
  , express     = require("express")
  , store       = require("connect-mongo")(express)
  , ejs         = require("ejs")
  , log         = require("./log");

/**
 * 初始化Express，依赖的配置文件参数有
 *  app.port
 *  app.views
 *  app.cookieSecret
 *  app.tmp
 * @param app Express实例
 */
function initExpress(app) {

  log.debug("initialize express");
  log.debug("express port : " + conf.app.port);
  log.debug("express views : " + conf.app.views);
  log.debug("express tmp : " + conf.app.tmp);
  log.debug("express sessionTimeout : " + conf.app.sessionTimeout);

  // 端口
  app.set("port", process.env.PORT || conf.app.port || 3000);
  app.set("views", path.join(process.cwd(), conf.app.views));
  app.set("view engine", "html");
  app.engine("html", ejs.__express);

  /**
   * Middleware
   * 生成标准favicon.ico，防止favicon.ico的404错误
   */
  //app.use(express.favicon());

  /**
   * Middleware
   * 记录Access log和Error log
   */
  app.use(express.logger("dev"));

  /**
   * Middleware
   * 压缩response data为gzip
   */
  //app.use(express.compress());

  /**
   * Middleware
   * 包含json(), urlencoded(), multipart()三个middleware
   */
  app.use(express.bodyParser({"uploadDir": conf.app.tmp}));

  /**
   * Middleware
   * 用于模拟DELETE and PUT方法
   * 可以在form里放在<input type="hidden" name="_method" value="put" />来模拟
   */
  app.use(express.methodOverride());

  /**
   * Middleware
   * 解析cookie
   */
  app.use(express.cookieParser(conf.app.cookieSecret));

  /**
   * Middleware
   * 提供基于cookie的session
   */
  app.use(express.session({
    "secret": conf.app.sessionSecret
  , "key": conf.app.sessionKey
  , "cookie": { "maxAge": conf.app.sessionTimeout * 60 * 60 * 1000 }
  , "store": new store({"db": conf.db.dbname, "host": conf.db.host, "port": conf.db.port})
  }));

  /**
   * Middleware
   * CSRF支持。需要在设定csrftoken的前面。
   */
  app.use(express.csrf());

  /**
   * development only
   */
  if ("development" === app.get("env")) {
    app.use(express.errorHandler());
  }

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(path.join(process.cwd(), "public")));
}

/**
 * 调用初始化函数
 */
exports.initialize = function() {
};

/**
 * 初始化express模块
 * @param app Express实例
 */
exports.express = function(app) {
  initExpress(app);
};
