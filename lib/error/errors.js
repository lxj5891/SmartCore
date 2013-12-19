/**
 * @file 异常类。
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

function Errors(message, code) {
  this.message = message;
  this.code = code;
  this.name = "Errors";
}

module.exports = exports = Errors;

Errors.HttpError    = require("./errors_http");
Errors.DBError      = require("./errors_db");
Errors.ParamError   = require("./errors_param");
