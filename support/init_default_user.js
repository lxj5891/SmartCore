/**
 * @file 缺省管理员用户信息登陆
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

process.env.NODE_CONFIG_DIR = __dirname + "/config";
process.env.LOG4JS_CONFIG = __dirname + "/config/log4js.json";

var program   = require("commander")
  , cmd       = require("../lib/command")
  , argv      = require("optimist").argv;

/**
 * 显示帮助信息
 */
function showHelp() {

  // 定义帮助信息
  program
    .version("0.0.1")
    .option("-d, --db", "database name")
    .option("-c, --collection", "user collection name");

  // 定义帮助信息中的例子
  program.on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ node support/init_default_user.js -d yukari -c users");
    console.log("");
  });

  program.parse(process.argv);
}

/**
 * 插入用户信息
 */
function insertUserData() {
  var userData = {
      "userName": "admin"
    , "first": "admin"
    , "last": ""
    , "password": "e3cfa171629240c8991f31af049b8b22a24c90ac4dc49ceb202faf7fb50bde07"
    , "email": "admin@dreamarts.co.jp"
    , "lang" : "ja"
    , "timezone": "GMT+09:00"
    , "valid": 1
    , "createAt": new Date()
    , "createBy": "script"
    , "updateAt": new Date()
    , "updateBy": "script"
    };

  cmd.insertData(argv.d || "salesfloor", "users", userData, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("insert data ok");
  });
}

showHelp();
insertUserData();
