/**
 * @file Smart核心服务的初始化
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var path        = require("path")
  , conf        = require("config")
  , express     = require("express")
  , _           = require("underscore")
  , store       = require("connect-mongo")(express)
  , ejs         = require("ejs")
  , i18n        = require("./i18n")
  , master      = require("./master")
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
 * 判断config项目是否存在
 * 含子元素的项目，用该方法来检查
 * @param {Object} item 被检测项目
 * @param {String} info log里输出的项目名称
 * @param {Function} print 打印方法
 * @returns {boolean} 项目不存在返回true
 */
function checkExist(item, info, print) {
  if (_.isEmpty(item)) {
    print(info + " is empty!");
    return true;
  }

  return false;
}

/**
 * 判断config项目是否为数字
 * @param {Object} item 被检测项目
 * @param {String} info log里输出的项目名称
 * @param {Function} print 打印方法
 * @returns {boolean} 项目不是数字返回true
 */
function checkNumber(item, info, print) {

  if (_.isNumber(item)) {
    log.info(info + " " + item);
    return false;
  }

  print(info + " is not a number!");
  return true;
}

/**
 * 判断config项目是否为字符
 * @param {Object} item 被检测项目
 * @param {String} info log里输出的项目名称
 * @param {Function} print 打印方法
 * @returns {boolean} 项目不是数字返回true
 */
function checkString(item, info, print) {

  if (_.isString(item)) {
    log.info(info + " " + item);
    return false;
  }

  print(info + " is empty!");
  return true;
}

/**
 * 校验config文件
 */
function validateConfig() {

  var hasError = false;

  // DB config
  if (!checkExist(conf.db, "config/db", log.error)) {
    hasError = hasError || checkString(conf.db.host, "config/db/host", log.error);
    hasError = hasError || checkNumber(conf.db.port, "config/db/port", log.error);
    hasError = hasError || checkString(conf.db.dbname, "config/db/dbname", log.error);

    checkString(conf.db.prefix, "config/db/prefix", log.warn);
    checkNumber(conf.db.pool, "config/db/pool", log.warn);
    checkExist(conf.db.schema, "conf.db.schema", log.warn);
  }

  // APP config
  if (!checkExist(conf.app, "config/app", log.error)) {

    checkNumber(conf.app.port, "config/app/port", log.warn);

    hasError = hasError || checkString(conf.app.views, "config/app/views", log.error);
    hasError = hasError || checkString(conf.app.cookieSecret, "config/app/cookieSecret", log.error);
    hasError = hasError || checkString(conf.app.sessionSecret, "config/app/sessionSecret", log.error);
    hasError = hasError || checkString(conf.app.sessionKey, "config/app/sessionKey", log.error);
    hasError = hasError || checkNumber(conf.app.sessionTimeout, "config/app/sessionTimeout", log.error);
    hasError = hasError || checkString(conf.app.tmp, "config/app/tmp", log.error);
    hasError = hasError || checkString(conf.app.hmackey, "config/app/hmackey", log.error);

    if (!checkExist(conf.app.i18n, "conf.app.i18n", log.warn)) {
      checkString(conf.app.i18n.cache, "config/app/i18n/cache", log.warn);
      checkString(conf.app.i18n.lang, "config/app/i18n/lang", log.warn);
      checkString(conf.app.i18n.category, "config/app/i18n/category", log.warn);
    }
  }

  // LOG config
  if (!checkExist(conf.log, "config/log", log.warn)) {
    if (!checkExist(conf.log.fluent, "config/log/fluent", log.warn)) {
      checkString(conf.log.fluent.enable, "config/log/fluent/enable", log.warn);
      checkString(conf.log.fluent.tag, "config/log/fluent/tag", log.warn);
      checkString(conf.log.fluent.host, "config/log/fluent/host", log.warn);
      checkNumber(conf.log.fluent.port, "config/log/fluent/port", log.warn);
      checkNumber(conf.log.fluent.timeout, "config/log/fluent/timeout", log.warn);
    }
  }

  // 如果必须向有错误，则拒绝启动
  if (hasError) {
    process.exit(1);
  }
}

/**
 * 调用初始化函数
 */
exports.initialize = function() {

  // 多国语全局变量注册
  global.__ = i18n.__;
  global.master = master.get;

  validateConfig();
};

/**
 * 初始化express模块
 * @param app Express实例
 */
exports.express = function(app) {
  initExpress(app);
};
