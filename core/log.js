/**
 * @file 输出Log。
 *  log在输出到文件的同时，默认还通过Fluent，输出到数据库中。
 *  Fluent的动作可以在配置文件的log节进行设定。
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var os          = require("os")
  , util        = require("util")
  , log4js      = require("log4js")
  , _           = require("underscore")
  , confLog     = require("config").log
  , confFluent  = confLog.fluent;

/**
 * Log type: To define the type of log
 */
var operation   = log4js.getLogger("operation")
  , application = log4js.getLogger("application")
  , audit       = log4js.getLogger("audit")
  , fluent      = null;

/**
 * Stack, Define global stack info.
 * @param {function} self this function.
 * @returns current method stack.
 */
function stack(self) {

  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };

  var err = new Error();
  Error.captureStackTrace(err, self);

  var result = err.stack;
  Error.prepareStackTrace = orig;

  return result;
}

/**
 * LineNo,
 *  Defines the number of lines of parent source code.
 *  it is global information.
 * @returns line number.
 */
function lineNo() {
  return stack(stack)[3].getLineNumber();
}

/**
 * FileName,
 *  Defines the name of the parent file.
 *  it is global information.
 * @returns file name.
 */
function fileName() {
  return stack(stack)[3].getFileName();
}

/**
 * Config:
 *  Reads the configuration file, and initializes the fluent.
 */
function initFluent() {

  if (confFluent.enable === "true") {

    fluent = require("fluent-logger");
    fluent.configure(confFluent.tag, {
        host: confFluent.host
      , port: confFluent.port
      , timeout: confFluent.timeout
      });
  }
}

/**
 * Config:
 *  Reads the configuration file, and initializes the log.
 */
function initLog4js() {

  // 环境变量里没有定义配置文件的路径，使用应用根目录下的配置文件
  log4js.configure(process.env.LOG4JS_CONFIG || process.cwd() + "/config/log4js.json");
}

/**
 * 发送log到fluent
 * @param {string} type log type
 * @param {string} body log info
 */
function emit(type, body) {

  if (confFluent.enable === "true") {
    fluent.emit(type, body);
  }
}

/**
 * 为了输出文件日志，对log对象进行格式化
 * @param {string} body 消息
 * @returns 格式化之后的消息字符串
 */
function formatFileLog(body) {
  return util.format("%s %s %s %s %s", body.message, body.user, body.host, body.file, body.line);
}

/**
 * 获取AP服务器IP地址的数组，获取的IP地址放到global对象中缓存
 * @returns 返回IP地址
 */
function ip() {

  if (global.addresses) {
    return global.addresses;
  }

  var interfaces = os.networkInterfaces()
    , addresses = [];

  _.each(interfaces, function(item) {
    _.each(item, function(address) {
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    });
  });

  global.addresses = addresses;
  return global.addresses;
}

/**
 * 生成json格式的log对象
 * @param {string} logtype log的类别
 * @param {string} loglevel log的级别
 * @param {string} content 输出的log详细
 * @param {string} userid 操作者
 * @returns log对象
 */
function toJson(logtype, loglevel, content, userid) {

  return {
      sec: new Date().getTime()
    , type: logtype
    , level: loglevel
    , message: content
    , user: userid ? userid : "-"
    , host: ip()
    , code: ""
    , category: ""
    , file: fileName()
    , line: lineNo()
    };
}

/**
 * debug log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.debug = function(message, user) {
  var body = toJson("application", "debug", message, user);

  application.debug(formatFileLog(body));
  emit("application", body);
};

/**
 * info log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.info = function(message, user) {
  var body = toJson("application", "info", message, user);

  application.info(formatFileLog(body));
  emit("application", body);
};

/**
 * warning log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.warn = function(message, user) {
  var body = toJson("application", "warn", message, user);

  application.warn(formatFileLog(body));
  emit("application", body);
};

/**
 * error log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.error = function(message, user) {
  var body = toJson("application", "error", message, user);

  application.error(formatFileLog(body));
  emit("application", body);
};

/**
 * audit log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.audit = function(message, user) {
  var body = toJson("audit", "info", message, user);

  audit.info(formatFileLog(body));
  emit("audit", body);
};

/**
 * operation log
 * @param {string} message log内容
 * @param {string} user 用户信息
 */
exports.operation = function(message, user) {
  var body = toJson("operation", "info", message, user);

  operation.info(formatFileLog(body));
  emit("operation", body);
};

/**
 * 初始化Fluent，log4js
 */
initFluent();
initLog4js();
