
"use strict";

process.env.NODE_CONFIG_DIR = process.cwd() + "/test/config";
process.env.LOG4JS_CONFIG = process.cwd() + "/test/config/log4js.json";

var cmd   = require("./command");

cmd.runCommand("jsdoc core/log.js -d docs", function() {
  console.log("OK!");
});
