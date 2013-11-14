/**
 * @file 单体测试对象：core/connection.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should      = require("should")
  , mongo       = require("mongoose")
  , schema      = mongo.Schema
  , connection  = require("../../coverage/core/connection");

/**
 * 测试代码
 */
describe("core/connection.js", function() {

  /**
   * 初始化测试数据
   */
  var Test = new schema({
    row: { type: String, description: "行" }
  });

  /**
   * 执行测试case
   */
  describe("model()", function() {

    /*****************************************************************/
    it("default table name.", function(done) {

      var mod = connection.model(undefined, "Test", Test);

      should.exist(mod);
      mod.should.have.property("modelName").and.equal("myTest");
      done();
    });

    /*****************************************************************/
    it("custom table name.", function(done) {

      // Test1的名字，在配置文件里定义为HelloTest1
      var mod = connection.model(undefined, "Test1", Test);

      should.exist(mod);
      mod.should.have.property("modelName").and.equal("HelloTest1");
      done();
    });
  });
});