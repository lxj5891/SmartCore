
"use strict";

process.env.NODE_CONFIG_DIR = process.cwd() + "/test/config";
process.env.LOG4JS_CONFIG = process.cwd()   + "/test/config/log4js.json";

var cmd   = require("../lib/command");

cmd.runCommand("jsdoc lib/log.js -d doc/jsdoc", function() {
  console.log("OK!");
});
