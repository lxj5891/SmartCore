
module.exports = {
  api: {
    common: require("./api/common")
  , document: require("./api/document")
  , group: require("./api/group")
  , notification: require("./api/notification")
  , search: require("./api/search")
  , template: require("./api/template")
  , user: require("./api/user")
  , dbfile: require("./api/dbfile")
  , apn: require("./api/apn")
  , log: require("./api/log")
  },
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
  },
  core: {
    loader: require("./core/loader")
  , amqp: require("./core/amqp")
  , auth: require("./core/auth")
  , authorityChecker: require("./core/authorityChecker")
  , errors: require("./core/errors")
  , response: require("./core/response")
  , log: require("./core/log")
  , mail: require("./core/mail")
  , middleware: require("./core/middleware")
  , process: require("./core/process")
  , solr: require("./core/solr")
  , util: require("./core/util")
  , context: require("./core/context")
  }
};
