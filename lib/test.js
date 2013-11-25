/**
 * @file 单元测试工具类，如初始化环境变量等
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

function initEnvironment() {
  process.env.TEST = 1;
  process.env.NODE_CONFIG_DIR = process.cwd() + "/test/config";
  process.env.LOG4JS_CONFIG = process.cwd()   + "/test/config/log4js.json";
}

function initLanguage() {
}

exports.befor = function() {
  initEnvironment();
  initLanguage();
};

