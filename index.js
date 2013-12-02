
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
  , commander:    require("commander")
  , optimist:     require("optimist")
  },

  /**
   * smart工具模块
   */
  framework: {
    loader:       require("./lib/loader")
  , amqp:         require("./lib/amqp")
  , auth:         require("./lib/auth")
  , errors:       require("./lib/errors")
  , response:     require("./lib/response")
  , log:          require("./lib/log")
  , mail:         require("./lib/mail")
  , middleware:   require("./lib/middleware")
  , util:         require("./lib/util")
  , context:      require("./lib/context")
  , constant:     require("./lib/constant")
  , connection:   require("./lib/connection")
  , command:      require("./lib/command")
  },

  /**
   * TODO:smart核心机能(通过ctrl开放)
   */
  ctrl: {
    aclink:       require("./lib/controllers/ctrl_aclink")
  , company:      require("./lib/controllers/ctrl_company")
  , file:         require("./lib/controllers/ctrl_file")
  , group:        require("./lib/controllers/ctrl_group")
  , i18n:         require("./lib/controllers/ctrl_i18n")
  , master:       require("./lib/controllers/ctrl_master")
  , user:         require("./lib/controllers/ctrl_user")
  }
};
