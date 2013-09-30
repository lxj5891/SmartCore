var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , util = require('util')
  , domain = require('domain')
  , json = require('./json')
  , error = require('./error')
  , log = require('./log');

var Handler = module.exports = function() {
  EventEmitter.call(this);
};

util.inherits(Handler, EventEmitter);

/**
 * 使用事件机制，抛出异常
 * @param error
 */
Handler.prototype.throw = function(error) {
  this.emit('error', error);
};

/**
 * 初始化
 * @param req
 * @param res
 * @returns {*}
 */
Handler.prototype.bind = function(req, res) {
  this.req = req;
  this.res = res;

  this.on('error', function(error){
    this.res.send(error.code, json.errorSchema(error.code, error.message));
  });

  return this;
};

/**
 * 结束进程
 */
Handler.prototype.exit = function() {
  this.res.send(500, json.errorSchema(500, "InternalServerError"));

  // 延迟1秒，结束进程
  setTimeout(function () {
    process.exit(1);
  }, 1000);
};

/**
 * 客户端请求参数
 */
Object.defineProperty(Handler.prototype, "params", {
  get: function () {
    return _.union(this.req.query, this.req.body);
  }
});

Object.defineProperty(Handler.prototype, "uid", {
  enumerable: true
  , get: function () {
    return this.req.session.user._id;
  }
});

Object.defineProperty(Handler.prototype, "code", {
  enumerable: true
  , get: function () {
    return this.req.session.user.companycode;
  }
});

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

    if (!self.theDomain) {
      self.theDomain = domain.create();
      self.theDomain.on('error', function(e) {

        log.out("debug", e);
        self.exit();
      });
    }
    return self.theDomain;
  }
});

