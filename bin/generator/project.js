
"use strict";

var fs        = require("fs")
  , fsext     = require("fs-extra")
  , path      = require("path")
  , util      = require("../../lib/util");

/**
 * Create application at the given directory `path`.
 * @param {String} folder 应用程序名称
 */
exports.create = function(folder) {

  console.log("    " + folder + "/apis");
  console.log("    " + folder + "/config");
  console.log("    " + folder + "/controllers");
  console.log("    " + folder + "/logs");
  console.log("    " + folder + "/models");
  console.log("    " + folder + "/routes");
  fsext.mkdirsSync(folder + "/apis");
  fsext.mkdirsSync(folder + "/config");
  fsext.mkdirsSync(folder + "/controllers");
  fsext.mkdirsSync(folder + "/logs");
  fsext.mkdirsSync(folder + "/models");
  fsext.mkdirsSync(folder + "/routes");

  console.log("    " + folder + "/views");
  console.log("    " + folder + "/public");
  console.log("    " + folder + "/public/javascripts");
  console.log("    " + folder + "/public/images");
  console.log("    " + folder + "/public/stylesheets");
  fsext.mkdirsSync(folder + "/views");
  fsext.mkdirsSync(folder + "/public");
  fsext.mkdirsSync(folder + "/public/javascripts");
  fsext.mkdirsSync(folder + "/public/images");
  fsext.mkdirsSync(folder + "/public/stylesheets");
};

/**
 * 安装Admin功能
 * @param {String} folder 应用程序名称
 */
exports.installAdmin = function(folder) {

  var src = path.resolve(__dirname , "../..");

  console.log("    " + folder + "/smartadmin");
  console.log("    " + folder + "/views/smartadmin");
  console.log("    " + folder + "/public/smart");
  console.log("    " + folder + "/public/smartadmin");

  fsext.removeSync(folder + "/smartadmin");
  fsext.removeSync(folder + "/views/smartadmin");
  fsext.removeSync(folder + "/public/smart");
  fsext.removeSync(folder + "/public/smartadmin");

  fsext.copySync(src + "/app/admin",              folder + "/smartadmin");
  fsext.copySync(src + "/app/views/smartadmin",   folder + "/views/smartadmin");
  fsext.copySync(src + "/app/public/smart",       folder + "/public/smart");
  fsext.copySync(src + "/app/public/smartadmin",  folder + "/public/smartadmin");
};

/**
 * 安装配置文件，启动文件等
 * @param {String} appName 应用程序名称
 * @param {String} author 作者
 */
exports.installAppFiles = function(appName, author) {

  var srcFiles = [
    "/template/project_app.tmpl"
    , "/template/project_config.tmpl"
    , "/template/project_gitignore.tmpl"
    , "/template/project_gruntfile.tmpl"
    , "/template/project_jshintrc.tmpl"
    , "/template/project_log4js.tmpl"
    , "/template/project_package.tmpl"
    , "/template/project_routes.tmpl"
  ];

  var resultFiles = [
      "/app.js"
    , "/config/default.js"
    , "/.gitignore"
    , "/Gruntfile.js"
    , "/.jshintrc"
    , "/config/log4js.json"
    , "/package.json"
    , "/routes/index.js"
    ];

  var params = { author: author, appName: appName || "Author" };

  for (var i = 0; i < resultFiles.length; i++) {
    var resultFile = appName + resultFiles[i];
    if (!fs.existsSync(resultFile)) {

      var srcFile = path.resolve(__dirname, "..") + srcFiles[i];
      util.ejsParser(srcFile, params, resultFile);
      console.log("    create : " + resultFile);
    }
  }

};
