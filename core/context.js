/**
 * @file 应用程序上下文，主要负责异常处理和参数传递。
 * 异常处理思路：
 *  1. API层，生成Handler实例，并向后续函数传递
 *  2. 通常的程序捕获的异常，通过Handler明确的emit出去，然后由API层捕获并返回
 *  3. 没有捕获的非异步异常，会由Express的错误处理函数捕获，并返回
 *  4. 异步异常，或有可能产生异步异常的地方，要用domain捕获，捕获之后返回并杀掉当前进程
 *  5. node进程的重启依靠forever的重启功能，NGINX配置成不能访问时，对其他的AP做请求
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _             = require("underscore")
  , util          = require("util")
  , domain        = require("domain")
  , emitter       = require("events").EventEmitter
  , json          = require("./json")
  , log           = require("./log");

/**
 * Context实例，为了能通过该类发送异常，所以继承EventEmitter
 * @type {Function}
 */
var Handler = module.exports = function() {
  emitter.call(this);
};
util.inherits(Handler, emitter);

/**
 * 使用req与res对context进行初始化
 * @param req 请求
 * @param res 相应
 * @returns {*} context实例
 */
Handler.prototype.bind = function(req, res) {

  this.req = req;
  this.res = res;

  // 将异常转换为响应，并通过res送出
  this.on("error", function(error){
    this.res.send(error.code, json.errorSchema(error.code, error.message));
  });

  return this;
};

/**
 * 抛出异常，使用事件机制发送异常
 * @param error 异常
 */
Handler.prototype.pitch = function(error) {
  this.emit("error", error);
};

/**
 * 结束进程
 */
Handler.prototype.exit = function() {

  // 相应客户请求
  this.res.send(500, json.errorSchema(500, "InternalServerError"));

  // 为了等待前一步骤的处理，延迟1秒结束进程
  setTimeout(function () { process.exit(1); }, 1000);
};

/**
 * 客户端请求参数
 * 合并了GET，POST方法的请求参数
 */
Object.defineProperty(Handler.prototype, "params", {
  get: function () {
    return _.union(this.req.query, this.req.body);
  }
});

/**
 * 用户ID
 */
Object.defineProperty(Handler.prototype, "uid", {
    enumerable: true
  , get: function () {
      return this.req.session.user._id;
    }
  });

/**
 * 公司代码
 */
Object.defineProperty(Handler.prototype, "code", {
    enumerable: true
  , get: function () {
      return this.req.session.user.companycode;
    }
  });

/**
 * 用户信息
 */
Object.defineProperty(Handler.prototype, "user", {
  get: function () {
    return this.req.session.user;
  }
});

/**
 * 异步操作里，有可能产生异常时，使用该domain执行对象代码
 * 注意！当异步函数产生异常时，会结束进程
 */
Object.defineProperty(Handler.prototype, "domain", {
  get: function () {
    var self = this;

    if (!self._domain) {
      self._domain = domain.create();
      self._domain.on("error", function(e) {

        log.out("debug", e);
        self.exit();
      });
    }

    return self._domain;
  }
});
