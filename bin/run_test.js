
"use strict";

var fs        = require("fs")
  , os        = require("os")
  , path      = require("path")
  , exec      = require("child_process").exec
  , test      = require("../core/test")
  , home      = path.resolve(__dirname , "..");

/**
 * 测试对象代码
 *  注意！由于log的测试会删除日志文件，所以必须先与其他测试代码执行
 * @type {Array}
 */
var target = [
    "test/core/test_log.js"
  , "test/core/test_context.js"
  , "test/core/test_errors.js"
  , "test/core/test_connection.js"

  , "test/modules/test_mod_user.js"
  , "test/modules/test_mod_group.js"
  , "test/controllers/test_ctrl_user.js"
  , "test/controllers/test_ctrl_group.js"

  , "test/modules/test_mod_company.js"
  , "test/controllers/test_ctrl_company.js"

  , "test/modules/test_mod_aclink.js"
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
if (!fs.existsSync("coverage")) {
  fs.mkdirSync("coverage");
}

var rm = "Windows_NT" === os.type() ? "rd /S /Q coverage" : "rm -rf coverage";

/**
 * 清除文件，生成converage代码，并执行测试case
 */
runCommand(rm, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  // 创建文件夹
  fs.mkdirSync("coverage");

  // 生成converage代码
  var routes      = "jscoverage routes/ coverage/routes/";
  var api         = "jscoverage api/ coverage/api/";
  var controllers = "jscoverage controllers/ coverage/controllers/";
  var modules     = "jscoverage modules/ coverage/modules/";
  var core        = "jscoverage core/ coverage/core/";
  runCommand(routes, function() {});
  runCommand(api, function() {});
  runCommand(controllers, function() {});
  runCommand(modules, function() {});
  runCommand(core, function() {});

  // 执行测试代码，生成报告
  var mocha = "mocha " + target.join(" ") + " -R html-cov > coverage/coverage.html";

  // 在环境变量里添加测试标识，数据库连接时根据该标识切换要使用的数据库
  test.befor();

  runCommand(mocha, function(err) {
    if (err) {
      console.log(err);
      return;
    }

    // 执行成功
    console.log("OK!");
  });

});
