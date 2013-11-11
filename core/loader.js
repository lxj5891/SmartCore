/**
 * @file Smart核心服务的初始化
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var i18n        = require("i18n")
  , path        = require("path")
  , conf        = require("config")
  , express     = require("express")
  , store       = require("connect-mongo")(express)
  , ejs         = require("ejs")
  , log         = require("./log");

/**
 * 初始化多国语言，固定支持中日英3种语言
 * @param defaultLang 语言名
 */
function initI18n(defaultLang) {

  log.debug("initialize i18n : " + defaultLang);

  // TODO: 语言可以自由追加
  i18n.configure({"locales": ["en", "ja", "zh"]
    , "register": global
    , "updateFiles": false
  });
  i18n.setLocale(defaultLang);
}

/**
 * 初始化Express，依赖的配置文件参数有
 *  app.port
 *  app.views
 *  app.cookieSecret
 *  app.tmp
 * @param app Express实例
 */
function initExpress(app) {

  // 端口
  app.set("port", process.env.PORT || conf.app.port || 3000);

  /**
   * Middleware
   * 生成标准favicon.ico，防止favicon.ico的404错误
   */
  app.use(express.favicon());

  app.set("views", path.join(__dirname, conf.app.views));
  app.set("view engine", "html");
  app.engine("html", ejs.__express);
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(app.router);

  /**
   * Middleware
   * 记录Access log和Error log
   */
  app.use(express.logger("dev"));

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
   * 压缩response data为gzip
   */
  app.use(express.compress());

  /**
   * Middleware
   * 包含json(), urlencoded(), multipart()三个middleware
   */
  app.use(express.bodyParser({"uploadDir": conf.app.tmp}));

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
}

/**
 * 调用初始化函数
 */
exports.initialize = function() {
  initI18n("ja");
};

/**
 * 初始化express模块
 * @param app Express实例
 */
exports.express = function(app) {
  initExpress(app);
};
