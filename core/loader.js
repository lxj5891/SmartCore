/**
 * @file Smart核心服务的初始化
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var i18n        = require("i18n")
  , log         = require("./log");

/**
 * 初始化多国语言，固定支持中日英3种语言
 * @param defaultLang 语言名
 */
function initI18n(defaultLang) {

  log.debug("initialize i18n : " + defaultLang);

  // TODO: 语言可以自由追加
  i18n.configure({"locales": ["en", "ja", "zh"]
    , "register": global
    , "updateFiles": false
  });
  i18n.setLocale(defaultLang);
}

/**
 * 调用初始化函数
 */
exports.initialize = function() {
  initI18n("ja");
};
