/**
 * @file 异常类。以HTTP Status Codes为基础定义类。
 * HTTP Status Codes:
 *  200 OK
 *  304 Not Modified
 *  400 Bad Request（已定义）
 *  401 Unauthorized（已定义）
 *  402 Payment Required
 *  403 Forbidden（已定义）
 *  404 Not Found（已定义）
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
 *  500 Internal Server Error（已定义）
 *  501 Not Implemented
 *  502 Bad Gateway
 *  503 Service Unavailable
 *  504 Gateway timeout
 *  505 HTTP Version not supported
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var util = require("util");

/**
 * AbstractError:
 *  Create a new Abstract Error constructor.
 * @param {string} msg error message
 * @param {Constructor} constr 
 */
var AbstractError = function (msg, constr) {

  // If defined, pass the constr property to V8's
  // captureStackTrace to clean up the output
  Error.captureStackTrace(this, constr || this);
  
  // If defined, store a custom error message
  this.message = msg || "Error";
};

// Extend our AbstractError from Error
util.inherits(AbstractError, Error);

// Give our Abstract error a code property. Helpful for logging the error later.
AbstractError.prototype.code = -1;

/**
 * BadRequestError:
 *  由于客户端的请求存在问题，导致后台无法处理而产生的错误。
 *  如，参数错误是典型的BadRequest错误。
 * @param {string} msg error message
 */
var BadRequestError = function (msg) {

  this.code = 400;
  BadRequestError.super_.call(this, msg, this.constructor);
};
util.inherits(BadRequestError, AbstractError);

/**
 * UnauthorizedError:
 *  没有验证。
 * @param {string} msg error message
 */
var UnauthorizedError = function (msg) {

  this.code = 401;
  UnauthorizedError.super_.call(this, msg, this.constructor);
};
util.inherits(UnauthorizedError, AbstractError);

/**
 * ForbiddenError:
 *
 * @param {string} msg error message
 */
var ForbiddenError = function (msg) {

  this.code = 403;
  ForbiddenError.super_.call(this, msg, this.constructor);
};
util.inherits(ForbiddenError, AbstractError);

/**
 * NotFoundError:
 *  请求的资源不存在。
 * @param {string} msg error message
 */
var NotFoundError = function (msg) {

  this.code = 404;
  NotFoundError.super_.call(this, msg, this.constructor);
};
util.inherits(NotFoundError, AbstractError);

/**
 * InternalServerError:
 *  后台的内部错误。需要管理员的协助才能够解决。
 * @param {string} msg error message
 */
var InternalServerError = function (msg) {

  this.code = 500;
  InternalServerError.super_.call(this, msg, this.constructor);
};
util.inherits(InternalServerError, AbstractError);

/**
 * exports:
 *  To define a public function.
 */
module.exports = {
  BadRequest:     BadRequestError
, Unauthorized:   UnauthorizedError
, NotFound:       NotFoundError
, InternalServer: InternalServerError
, Forbidden:      ForbiddenError
};
