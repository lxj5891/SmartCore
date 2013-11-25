
/**
 * @file 单体测试对象：core/log.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should    = require("should")
  , fs        = require("fs");

/**
 * 读取文件行数
 * @param file 文件名
 * @param callback 返回行数的回调函数
 */
function lineCount(file, callback) {
  var count = 0;

  fs.createReadStream(file)
    .on("data", function(chunk) {
      for (var i = 0; i < chunk.length; ++i) {
        if (chunk[i] === 10) { count++; }
      }
    })
    .on("end", function() {
      callback(count);
    });
}

/**
 * 删除旧的日志文件
 */
function removeLogFile() {

  var application = process.cwd() + "/logs/application.log";
  var audit = process.cwd() + "/logs/audit.log";
  var operation = process.cwd() + "/logs/operation.log";
  if (fs.existsSync(application)) {
    fs.unlinkSync(application);
  }
  if (fs.existsSync(audit)) {
    fs.unlinkSync(audit);
  }
  if (fs.existsSync(operation)) {
    fs.unlinkSync(operation);
  }
}

removeLogFile();
var log = require("../../coverage/core/log");

/**
 * 测试代码
 */
describe("Log", function() {

  /**
   * 初始化测试数据
   */
  var appliLog = process.cwd() + "/logs/application.log"
    , auditLog = process.cwd() + "/logs/audit.log"
    , operaLog = process.cwd() + "/logs/operation.log";

  /**
   * 执行测试case
   */
  /*****************************************************************/
  it("debug", function(done) {

    log.debug("debuglog");
    log.debug("debuglog", "uid");

    lineCount(appliLog, function(count) {

      should.exist(count);
      count.should.equal(2);
      done();
    });
  });

  /*****************************************************************/
  it("info", function(done) {

    log.info("info");
    log.info("info", "uid");

    lineCount(appliLog, function(count) {

      count.should.equal(4);
      done();
    });
  });

  /*****************************************************************/
  it("warn", function(done) {

    log.warn("warn");
    log.warn("warn", "uid");

    lineCount(appliLog, function(count) {

      count.should.equal(6);
      done();
    });
  });

  /*****************************************************************/
  it("error", function(done) {

    log.error("error");
    log.error("error", "uid");

    lineCount(appliLog, function(count) {

      count.should.equal(8);
      done();
    });
  });

  /*****************************************************************/
  it("audit", function(done) {

    log.audit("audit");
    log.audit("audit", "uid");

    lineCount(auditLog, function(count) {

      count.should.equal(2);
      done();
    });
  });

  /*****************************************************************/
  it("operation", function(done) {

    log.operation("operation");
    log.operation("operation", "uid");

    lineCount(operaLog, function(count) {

      count.should.equal(2);
      done();
    });
  });

});


