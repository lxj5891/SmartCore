
/**
 * @file 单体测试对象：core/log.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should  = require("should")
  , log     = require("../../coverage/core/log.js");

/**
 * 测试代码
 */
describe("Log", function() {

  /**
   * 初始化测试数据
   */
  var data = {
  };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  it("debug", function(done) {

    company.add(data, function(err, result) {

      should.not.exist(err);
      should.exist(result);
      result.path.should.equal("1");
      result.valid.should.equal(1);

      done();
    });
  });

  /*****************************************************************/
  it("getList", function(done) {

    company.getList({}, 0, 1, function() {

      done();
    });
  });

});








var log = require('../../core/log');

exports.testDebug = function(test) {
  test.equal('abc', 'abc');
  //test.expect(1);
  test.ok(true, "this assertion should pass")
  test.done();
};

exports.testInfo = function(test) {
  log.out('info', '中文');
  test.equal(2, 2);
  test.done();
};

exports.testGroup = {
  setUp: function (callback) {
    log.out('info', 'setUp');
    this.foo = 'bar';
    callback();
  },
  tearDown: function (callback) {
    log.out('info', 'tearDown');
    callback();
  },
  test1: function (test) {
    test.equals(this.foo, 'bar');
    test.done();
  },
  test2: function (test) {
    test.equals(this.foo, 'bar');
    test.done();
  }
};