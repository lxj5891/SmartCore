/**
 * @file 单体测试对象：modules/mod_company.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should  = require("should")
  , company = require("../../coverage/modules/mod_company");

/**
 * 测试代码
 */
describe("modules/mod_company.js", function() {

  /**
   * 初始化测试数据
   */
  var id = ""
    , code = ""
    , now = Date.now().toString()
    , data = {
      name        : "4"
    , domain      : now
    , type        : "2"
    , extend      : { mail: "test@dac.com", kana: "kana" }
    , valid       : 1
    , createAt    : new Date()
    , createBy    : "8"
    , updateAt    : new Date()
    , updateBy    : "9"
    };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {
    it("correct create new company", function(done) {

      company.add(data, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        should.exist(result._id);
        should.exist(result.code);
        result.should.have.property("name").and.equal("4");
        result.should.have.property("domain").and.equal(now);
        result.should.have.property("type").and.equal("2");
        result.should.have.property("extend");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createBy").and.equal("8");
        result.should.have.property("createAt");
        result.should.have.property("updateBy").and.equal("9");
        result.should.have.property("updateAt");
        result.extend.mail.should.equal("test@dac.com");

        id = result._id;
        code = result.code;
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("correct get list", function(done) {

      company.getList({name: "4"}, 0, 10, {updateAt: "desc"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.not.be.below(1);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getByDomain()", function() {
    it("correct getByDomain", function(done) {

      company.getByDomain(now, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.domain.should.equal(now);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getByCode()", function() {
    it("correct getByCode", function(done) {

      company.getByCode(code, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.domain.should.equal(now);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correct get", function(done) {

      company.get(id, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.domain.should.equal(now);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("correct update", function(done) {

      company.update(id, {domain: now + "1"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.domain.should.equal(now + "1");
        done();
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("correct total", function(done) {

      company.total({"code": code}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(1);
        done();
      });
    });
  });

});
