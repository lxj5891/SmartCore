/**
 * Log:
 * Copyright (c) 2012 Author Name <l_li@dreamarts.co.jp>
 * @see http://10.2.8.224/ssdb
 */

/**
 * Log Level:
 *  trace
 *  debug
 *  info
 *  warn
 *  error
 *  fatal
 */

var log4js = require('log4js');

/**
 * Config:
 *  Reads the configuration file, and initializes the log.
 */
log4js.configure('./config/log4js.json', {});
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.console());

/**
 * Log type:
 *  To define the type of log
 */
var operation = log4js.getLogger('operation');
var application = log4js.getLogger('application');
var audit = log4js.getLogger('audit');

/**
 * __stack:
 *  Define global stack info.
 */
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
})

/**
 * __line:
 *  Defines the number of lines of source code.
 *  it is global information.
 */
Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
})

/**
 * __pline:
 *  Defines the number of lines of parent source code.
 *  it is global information.
 */
Object.defineProperty(global, '__pline', {
  get: function(){
    return __stack[2].getLineNumber();
  }
})

/**
 * __pfilename:
 *  Defines the name of the parent file.
 *  it is global information.
 */
Object.defineProperty(global, '__pfilename', {
  get: function(){
    return __stack[2].getFileName();
  }
})

/**
 * Emitter:
 *  To monitor the event log.
 */
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

// trace
emitter.on('trace', function(type, message, source, line){
  if (type == 'operation') {
    operation.trace(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.trace(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.trace(message + '  ' + source + ':' + line);
  }
})

// debug
emitter.on('debug', function(type, message, source, line){
  if (type == 'operation') {
    operation.debug(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.debug(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.debug(message + '  ' + source + ':' + line);
  }
})

// info
emitter.on('info', function(type, message, source, line){
  if (type == 'operation') {
    operation.info(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.info(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.info(message + '  ' + source + ':' + line);
  }
})

// warn
emitter.on('warn', function(type, message, source, line){
  if (type == 'operation') {
    operation.warn(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.warn(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.warn(message + '  ' + source + ':' + line);
  }
})

// error
emitter.on('error', function(type, message, source, line){
  if (type == 'operation') {
    operation.error(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.error(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.error(message + '  ' + source + ':' + line);
  }
})

// fatal
emitter.on('fatal', function(type, message, source, line){
  if (type == 'operation') {
    operation.fatal(message + '  ' + source + ':' + line);
  }
  if (type == 'application') {
    application.fatal(message + '  ' + source + ':' + line);
  }
  if (type == 'audit') {
    audit.fatal(message + '  ' + source + ':' + line);
  }
})

/**
 * Out:
 *  Emit a log event.
 */
function out(level, type, message, source, line){
  emitter.emit(level, type, message, source, line);
}

/**
 * Out:
 *  Outputs the application log.
 * @param {String} level log level
 * @param {String} message log message
 */
exports.out = function(level, message){
  out(level, 'application', message, __pfilename, __pline);
}

/**
 * Opera:
 *  Outputs the operation log.
 * @param {String} level log level
 * @param {String} message log message
 */
exports.opera = function(level, message){
  out(level, 'operation', message, __pfilename, __pline);
}

/**
 * Audit:
 *  Outputs the audit log.
 * @param {String} level log level
 * @param {String} message log message
 */
exports.audit = function(level, message){
  out(level, 'audit', message, __pfilename, __pline);
}

