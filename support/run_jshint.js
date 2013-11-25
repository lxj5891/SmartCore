
"use strict";

process.env.NODE_CONFIG_DIR = process.cwd() + "/test/config";
process.env.LOG4JS_CONFIG   = process.cwd() + "/test/config/log4js.json";

var cmd   = require("./command");

cmd.runCommand("plato -d doc/jshint -l .jshintrc test/cases/core/test_log.js", function() {
  console.log("OK!");
});
