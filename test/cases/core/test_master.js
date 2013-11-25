/**
 * @file 单体测试对象：core/master.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should      = require("should")
  , master  = require("../../coverage/core/master");

/**
 * 测试代码
 */
describe("core/master.js", function() {

  /**
   * 初始化测试数据
   */

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("get()", function() {
    it("should return OK.", function() {

      master.update("abc", "123");
      should(master.get("a","bc")).eql("123");
    });
  });

  /*****************************************************************/
  describe("update()", function() {

    it("should return OK.", function() {
      master.update("abc","123");
      should(master.get("a","bc")).eql("123");
    });
  });

  /*****************************************************************/
  describe("delete()", function() {

    it("should return OK.", function() {
      master.update("abc","123");
      master.delete("abc");
      should(master.get("a","bc")).eql(null);
    });
  });
});