/**
 * Errors:
 * Copyright (c) 2012 Author Name l_li
 */

/**
 * HTTP Status Codes:
 *  200 OK
 *  304 Not Modified
 * *400 Bad Request
 * *401 Unauthorized
 *  402 Payment Required
 *  403 Forbidden
 * *404 Not Found
 *  405 Method Not Allowed
 *  406 Not Acceptable
 *  407 Proxy authentication required
 *  408 Request Timeout
 *  409 Conflict
 *  410 Gone
 *  411 Length Required
 *  412 Precondition Failed
 *  413 Request Entity Too Large
 *  414 Request-URI Too Large
 *  415 Unsupported Media Type
 *  420 Enhance Your Calm
 * *500 Internal Server Error
 *  501 Not Implemented
 *  502 Bad Gateway
 *  503 Service Unavailable
 *  504 Gateway timeout
 *  505 HTTP Version not supported
 */

var util = require('util');

/**
 * AbstractError:
 *  Create a new Abstract Error constructor.
 * @param {String} msg error message
 * @param {Constructor} constr 
 */
var AbstractError = function (msg, constr) {
  
  // If defined, pass the constr property to V8's
  // captureStackTrace to clean up the output
  Error.captureStackTrace(this, constr || this);
  
  // If defined, store a custom error message
  this.message = msg || 'Error';
};

// Extend our AbstractError from Error
util.inherits(AbstractError, Error);

// Give our Abstract error a code property. Helpful for logging the error later.
AbstractError.prototype.code = -1;


/**
 * DatabaseError:
 *  数据库操作错误（未分类）
 * @param {Number} c error code
 * @param {String} msg error message
 */
var DatabaseError = function (c, msg) {
  this.code = c;
  DatabaseError.super_.call(this, msg, this.constructor);
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.message = 'Database Error';

/**
 * BadRequestError:
 *  由于客户端的请求存在问题，导致后台无法处理而产生的错误。
 * @param {String} msg error message
 */
var BadRequestError = function (msg) {
  this.code = 400;
  BadRequestError.super_.call(this, msg, this.constructor);
};
util.inherits(BadRequestError, AbstractError);



/**
 * UnauthorizedError:
 *  没有验证。
 * @param {String} msg error message
 */
var UnauthorizedError = function (msg) {
  this.code = 401;
  UnauthorizedError.super_.call(this, msg, this.constructor);
};
util.inherits(UnauthorizedError, AbstractError);

/**
 * NotFoundError:
 *  请求的资源不存在。
 * @param {String} msg error message
 */
var NotFoundError = function (msg) {
  this.code = 404;
  NotFoundError.super_.call(this, msg, this.constructor);
};
util.inherits(NotFoundError, AbstractError);

/**
 * InternalServerError:
 *  后台的内部错误。需要管理员的协助才能够解决。
 * @param {String} msg error message
 */
var InternalServerError = function (msg) {
  this.code = 500;
  InternalServerError.super_.call(this, msg, this.constructor);
};
util.inherits(InternalServerError, AbstractError);

/**
 * ForbiddenError:
 *  
 * @param {String} msg error message
 */
var ForbiddenError = function (msg) {
  this.code = 403;
  ForbiddenError.super_.call(this, msg, this.constructor);
};
util.inherits(ForbiddenError, AbstractError);

/**
 * exports:
 *  To define a public function.
 */
module.exports = {
    Database: DatabaseError
  , BadRequest: BadRequestError
  , Unauthorized: UnauthorizedError
  , NotFound: NotFoundError
  , InternalServer: InternalServerError
  , Forbidden: ForbiddenError
  };

/**
 * 处理未捕获的异常。
 *  由于，callback内部发生异常时，没有较好的处理机制，暂时使用process的异常捕获。
 *  TODO: 此方法在并发时，是否安全需确认。
 */
// process.on('uncaughtException', function(err) {
  // try {
  //   if (err instanceof AbstractError) {
  //     if (err.res) {
  //       err.res.send({code: err.code, msg: err.message});
  //     }
  //   }
  // } catch(error) {
  //   log.out('fatal', error);
  // }
  // log.out("debug", err);
// });

