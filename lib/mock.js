/**
 * @file 用来生成单元测试用的mock对象
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var log = require("./log");

/**
 * 生成Request对象
 * @returns {RequestMock} Request对象
 */
exports.getRequest = function() {

  var RequestMock = function() {};

  RequestMock.prototype.send = function(code, content) {
    log.debug(code);
    log.debug(content);
  };

  RequestMock.prototype.contentType = function(type) {
    log.debug(type);
  };

  return new RequestMock();
};

/**
 * 生成Response对象
 * @param {String} uid 用户ID
 * @param {Object} querys query string parameters
 * @param {Object} bodys body parameters
 * @returns {Object} Response对象
 */
exports.getResponse = function(uid, querys, bodys) {

  return {
    session: {
      user: {
        _id: uid
      , lang: "en"
      }
    }
  , query: querys || {}
  , body: bodys || {}
  };
};
