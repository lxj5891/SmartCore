
"use strict";

var fsext     = require("fs-extra")
  , path      = require("path");

/**
 * Create application at the given directory `path`.
 */
exports.create = function(folder) {

  fsext.mkdirsSync(folder + "/apis");
  fsext.mkdirsSync(folder + "/controllers");
  fsext.mkdirsSync(folder + "/logs");
  fsext.mkdirsSync(folder + "/models");
  fsext.mkdirsSync(folder + "/routes");

  fsext.mkdirsSync(folder + "/views");
  fsext.mkdirsSync(folder + "/public");
  fsext.mkdirsSync(folder + "/public/javascripts");
  fsext.mkdirsSync(folder + "/public/images");
  fsext.mkdirsSync(folder + "/public/stylesheets");

  console.log("    " + folder + "/apis");
  console.log("    " + folder + "/controllers");
  console.log("    " + folder + "/logs");
  console.log("    " + folder + "/models");
  console.log("    " + folder + "/routes");
  console.log("    " + folder + "/views");
  console.log("    " + folder + "/public");
  console.log("    " + folder + "/public/javascripts");
  console.log("    " + folder + "/public/images");
  console.log("    " + folder + "/public/stylesheets");
};

/**
 * 安装Admin功能
 */
exports.installAdmin = function(folder) {

  var src = path.resolve(__dirname , "..");

  fsext.removeSync(folder + "/smartadmin");
  fsext.removeSync(folder + "/views/smartadmin");
  fsext.removeSync(folder + "/public/smart");
  fsext.removeSync(folder + "/public/smartadmin");

  fsext.copySync(src + "/app/admin",              folder + "/smartadmin");
  fsext.copySync(src + "/app/views/smartadmin",   folder + "/views/smartadmin");
  fsext.copySync(src + "/app/public/smart",       folder + "/public/smart");
  fsext.copySync(src + "/app/public/smartadmin",  folder + "/public/smartadmin");

  console.log("    " + folder + "/smartadmin");
  console.log("    " + folder + "/views/smartadmin");
  console.log("    " + folder + "/public/smart");
  console.log("    " + folder + "/public/smartadmin");
};