/**
 * @file 单体测试对象：modules/mod_i18n.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should  = require("should")
  , i18n    = require("../../coverage/modules/mod_i18n");

/**
 * 测试代码
 */
describe("modules/mod_i18n.js", function() {

  /**
   * 初始化测试数据
   */
  var now = Date.now().toString()
    , data = {
      category    : "c1"
    , key         : now
    , lang        : {}
    , valid       : 1
    , createAt    : now
    , createBy    : "8"
    , updateAt    : now
    , updateBy    : "9"
    };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {
    it("correct create new i18n keyword", function(done) {

      data.lang.ja = "言語";
      data.lang.zh = "语言";
      i18n.add(null, data, function(err, ok, update) {

        should.not.exist(err);
        ok.should.equal(1);
        update.should.equal(false);

        done();
      });
    });

    it("correct update i18n keyword", function(done) {

      data.lang.ja = "言語1";
      data.lang.zh = "语言1";
      i18n.add(null, data, function(err, ok, update) {

        should.not.exist(err);
        ok.should.equal(1);
        update.should.equal(true);

        done();
      });
    });

  });

  /*****************************************************************/
  describe("getList()", function() {
    it("correct get list", function(done) {

      i18n.getList(null, { key: now }, 0, 10, {updateAt: "desc"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.not.be.below(1);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correct get", function(done) {

      i18n.get(null, now, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        result.should.have.property("category").and.equal("c1");
        result.should.have.property("lang").and.include({ ja: "言語1", zh: "语言1" });

        done();
      });
    });
  });
});
