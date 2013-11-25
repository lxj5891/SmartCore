
"use strict";

var fs        = require("fs")
  , os        = require("os")
  , path      = require("path")
  , exec      = require("child_process").exec
  , test      = require("../lib/test")
  , home      = path.resolve(__dirname , "..");

/**
 * 测试对象代码
 *  注意！由于log的测试会删除日志文件，所以必须先与其他测试代码执行
 * @type {Array}
 */
var target = [
    "test/cases/core/test_log.js"
  , "test/cases/core/test_context.js"
  , "test/cases/core/test_errors.js"
  , "test/cases/core/test_connection.js"

  , "test/cases/models/test_mod_user.js"
  , "test/cases/models/test_mod_group.js"
  , "test/cases/controllers/test_ctrl_user.js"
  , "test/cases/controllers/test_ctrl_group.js"

  , "test/cases/models/test_mod_company.js"
  , "test/cases/controllers/test_ctrl_company.js"

  , "test/cases/models/test_mod_master.js"
  , "test/cases/controllers/test_ctrl_master.js"

  , "test/cases/models/test_mod_file.js"
  , "test/cases/controllers/test_ctrl_file.js"

  , "test/cases/models/test_mod_i18n.js"
  , "test/cases/controllers/test_ctrl_i18n.js"

  , "test/cases/models/test_mod_aclink.js"
  ];

/**
 * 执行sh命令
 * @param command 命令
 * @param callback 执行完命令后的回调函数
 * @returns {*}
 */
function runCommand(command, callback) {

  return exec(command, function (error, stdout) {
    callback(error, stdout);
  });
}


/**
 * 变换工作路径
 */
process.chdir(home);
var rm = "Windows_NT" === os.type() ? "rd /S /Q test/coverage" : "rm -rf test/coverage";

/**
 * 清除文件，生成converage代码，并执行测试case
 */
runCommand(rm, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  // 创建文件夹
  fs.mkdirSync("test/coverage");

  // 生成converage代码
  var app = "jscoverage app/ test/coverage/app/";
  var lib = "jscoverage lib/ test/coverage/lib/";
  runCommand(app, function() {});
  runCommand(lib, function() {});

  // 执行测试代码，生成报告
  var mocha = "mocha " + target.join(" ") + " -R html-cov > test/coverage/coverage.html";

  // 在环境变量里添加测试标识，数据库连接时根据该标识切换要使用的数据库
  test.befor();
  console.log(require("fs").realpathSync("."));
  runCommand(mocha, function(err) {
    if (err) {
      console.log(err);
      return;
    }

    // 执行成功
    console.log("OK!");
  });

});
