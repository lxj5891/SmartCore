
module.exports = {

  /**
   * nodejs语言级别可用的模块
   */
  lang: {
    fs:           require("fs")
  , http:         require("http")           // Stability: 3 - Stable
  , util:         require("util")           // Stability: 4 - API Frozen
  , path:         require("path")           // Stability: 3 - Stable
  , domain:       require("domain")         // Stability: 2 - Unstable
  , os:           require("os")             // Stability: 4 - API Frozen
  , event:        require("events")         // Stability: 4 - API Frozen
  },

  /**
   * 第三方模块
   */
  util: {
    underscore:   require("underscore")
  , async:        require("async")
  , config:       require("config")
  , log4js:       require("log4js")
  , amqp:         require("amqp")
  , i18n:         require("i18n")
  , express:      require("express")
  , ejs:          require("ejs")
  , mongodb:      require("mongodb")        // MongoDB Nodejs Driver
  , mongoose:     require("mongoose")       // MongoDB object modeling tool
  , sessionstore: require("connect-mongo")  // MongoDB session store for Connect
  , nodemailer:   require("nodemailer")
  , validator:    require("validator")
  },

  /**
   * smart工具模块
   */
  framework: {
    loader:       require("./core/loader")
  , amqp:         require("./core/amqp")
  , auth:         require("./core/auth")
  , errors:       require("./core/errors")
  , response:     require("./core/response")
  , log:          require("./core/log")
  , mail:         require("./core/mail")
  , middleware:   require("./core/middleware")
  , process:      require("./core/process")
  , solr:         require("./core/solr")
  , util:         require("./core/util")
  , context:      require("./core/context")
  , checker:      require("./core/authorityChecker")
  },

  /**
   * smart核心机能
   */
  core: {
    common:       require("./api/common")
  , document:     require("./api/document")
  , group:        require("./api/group")
  , notification: require("./api/notification")
  , search:       require("./api/search")
  , template:     require("./api/template")
  , user:         require("./api/user")
  , dbfile:       require("./api/dbfile")
  , apn:          require("./api/apn")
  , log:          require("./api/log")
  },

  /**
   * 以下废弃预定
   */
  ctrl: {
    dbfile: require("./controllers/ctrl_dbfile")
  , document: require("./controllers/ctrl_document")
  , fulltextsearch: require("./controllers/ctrl_fulltextsearch")
  , group: require("./controllers/ctrl_group")
  , notification: require("./controllers/ctrl_notification")
  , search: require("./controllers/ctrl_search")
  , user: require("./controllers/ctrl_user")
  , category: require("./controllers/ctrl_category")
  },
  mod: {
    user: require("./modules/mod_user")
  , group: require("./modules/mod_group")
  , notification: require("./modules/mod_notification")
  , gridfs: require("./modules/gridfs")
  }
};
