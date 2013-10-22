/**
 * Log:
 * Copyright (c) 2013 Author Name l_li
 */

var log4js      = require('log4js')
  , util        = require('util')
  , os          = require('os')
  , _           = require('underscore')
  , context     = require('./handler')
  , conffluent  = require('config').log.fluent;

/**
 * Config:
 *  Reads the configuration file, and initializes the fluent.
 */
if (conffluent.enable == "true") {

  var fluent = require('fluent-logger');

  fluent.configure(conffluent.tag, {
      host: conffluent.host
    , port: conffluent.port
    , timeout: conffluent.timeout
  });
}

/**
 * Config:
 *  Reads the configuration file, and initializes the log.
 */
log4js.configure('./config/log4js.json');
if (require('config').log.console == "true") {
  log4js.addAppender(log4js.appenders.console());
}

/**
 * Log type: To define the type of log
 */
var operation   = log4js.getLogger('operation')
  , application = log4js.getLogger('application')
  , audit       = log4js.getLogger('audit');

// TODO: 向上兼容临时用，删除预定
exports.out = function(level, message) {
  exports.debug(message, "-");
}

/**
 * debug log
 * @param message
 * @param user
 */
exports.debug = function(message, user) {
  var body = json("application", "debug", message, user);

  application.debug(space(body));
  emit("application", body);
};


exports.info = function(essage, user) {
  var body = json("application", "info", message, user);

  application.info(space(body));
  emit("application", body);
};

exports.warn = function(essage, user) {
  var body = json("application", "warn", message, user);

  application.warn(space(body));
  emit("application", body);
};

exports.error = function(essage, user) {
  var body = json("application", "error", message, user);

  application.error(space(body));
  emit("application", body);
};

exports.audit = function(message_, user_) {
  var body = json("audit", "info", message_, user_);

  audit.info(space(body));
  emit("audit", body);
};

exports.operation = function(message_, user_) {
  var body = json("operation", "info", message_, user_);

  operation.info(space(body));
  emit("operation", body);
};

function emit(type, body) {

  if (conffluent.enable == "true") {
    fluent.emit(type, body);
  }
}

function space(body) {
  return util.format("%s %s %s %s %s", body.message, body.user, body.host, body.file, body.line);
}

function ltsv(body) {

  var result = "";

  _.each(body, function(val, key){
    result = util.format("%s%s:'%s'\t", result, key, val);
  });

  return result;
}

function json(type_, level_, message_, user_) {

  var result = {
      sec: new Date().getTime()
    , type: type_
    , level: level_
    , message: message_
    , user: user_ ? user_ : "-"
    , host: ip()
    , code: ""
    , category: ""
    , file: __pfilename
    , line: __pline
  };

  return result;
}

/**
 * 获取AP服务器IP地址，获取的IP地址放到global对象中缓存
 * @returns {*}
 */
function ip() {

  if (global.addresses) {
    return global.addresses;
  }

  var interfaces = os.networkInterfaces()
    , addresses = [];

  for (k in interfaces) {
    for (k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family == 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
    }
  }

  global.addresses = addresses;

  return global.addresses;
}

/**
 * __stack:
 *  Define global stack info.
 */
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

/**
 * __line:
 *  Defines the number of lines of source code.
 *  it is global information.
 */
Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});

/**
 * __pline:
 *  Defines the number of lines of parent source code.
 *  it is global information.
 */
Object.defineProperty(global, '__pline', {
  get: function(){
    return __stack[2].getLineNumber();
  }
});

/**
 * __pfilename:
 *  Defines the name of the parent file.
 *  it is global information.
 */
Object.defineProperty(global, '__pfilename', {
  get: function(){
    return __stack[2].getFileName();
  }
});
