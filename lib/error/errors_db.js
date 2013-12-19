/**
 * @file DB异常类。
 * DB Status Codes:
 *
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var util   = require("util")
  , errors = require("./errors.js");

var statusCodes = {
    D0001: "Failed to find"
  , D0002: "Failed to save"
  , D0003: "Failed to edit"
  , D0004: "Failed to remove"
  };

function DBError (code, message) {

  this.code = code;
  this.message = message || statusCodes[code];
  this.name = "DBError";
}

util.inherits(DBError, errors);


/*!
 * exports
 */

module.exports = DBError;