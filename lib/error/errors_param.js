/**
 * @file パラメタ异常类。
 * parm Status Codes:
 *
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var util   = require("util")
  , errors = require("./errors.js");

var statusCodes = {
    P0001: "Invalid Number"
  , P0002: "Invalid String"
  , P0003: "Invalid Array"
  , P0004: "Invalid Object"
  , P0005: "Invalid Data"
  , P0006: "Invalid ObjectId"
  , P0007: "Invalid email"
  , P0008: "Invalid ip"
  , P0009: "Invalid URL"
  , P0010: "Invalid PostParam"
  , P0011: "Invalid GetParam"
  , P0012: "Invalid UrlParam"
  , P0013: "Value is required"
  };

function ParamError (code, message) {

  this.code = code;
  this.message = message || statusCodes[code];
}

util.inherits(ParamError, errors);

/*!
 * exports
 */

module.exports = ParamError;