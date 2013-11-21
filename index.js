
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
  , util:         require("./core/util")
  , context:      require("./core/context")
  , constant:     require("./core/constant")
  , connection:   require("./core/connection")
  },

  /**
   * smart核心机能
   */
  core: {
//    group:        require("./api/group")
//  , user:         require("./api/user")
//  , file:         require("./api/file")
//  , log:          require("./api/log")
  },

  /**
   * TODO:smart核心机能(通过ctrl开放？)
   */
  ctrl: {
    aclink:       require("./controllers/ctrl_aclink")
  , company:      require("./controllers/ctrl_company")
  , file:         require("./controllers/ctrl_file")
  , group:        require("./controllers/ctrl_group")
//  , log:          require("./controllers/ctrl_log")
  , master:       require("./controllers/ctrl_master")
  , user:         require("./controllers/ctrl_user")
  }
};
