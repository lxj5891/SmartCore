/**
 * @file 单体测试对象：controllers/ctrl_company.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var should  = require("should")
  , mock    = require("../../../coverage/lib/mock")
  , context = require("../../../coverage/lib/context")
  , company = require("../../../coverage/lib/controllers/ctrl_company");

/**
 * 测试代码
 */
describe("controllers/ctrl_company.js", function() {

  /**
   * 初始化测试数据
   */
  var now = Date.now().toString()
    , res = mock.getRequest()
    , req = mock.getResponse("12345678", {}, {
      name: "dac"
    , domain: now
    , type: "1"
    , extend: {
        address: "liaoning"
      , tel: "0411-12345678"
      }
    })
    , handler = new context().bind(req, res);

  describe("add()", function() {

    /*****************************************************************/
    it("add new company", function(done) {
      company.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        // 全字段正确性检查
        should.exist(result._id);
        should.exist(result.code);
        result.should.have.property("name").and.equal("dac");
        result.should.have.property("domain").and.equal(now);
        result.should.have.property("type").and.equal("1");
        result.should.have.property("extend");
        result.should.have.property("createBy").and.equal("12345678");
        result.should.have.property("createAt");
        result.should.have.property("updateBy").and.equal("12345678");
        result.should.have.property("updateAt");
        result.extend.address.should.equal("liaoning");
        result.extend.tel.should.equal("0411-12345678");

        done();
      });
    });

    /*****************************************************************/
    it("code not empty", function(done) {

      handler.params.code = "code";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.code.min"));
        done();
      });
    });

    /*****************************************************************/
    it("name notEmpty", function(done) {

      handler.params.code = "";
      handler.params.name = "";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.name.min"));
        done();
      });
    });

    /*****************************************************************/
    it("name len", function(done) {

      handler.params.name = "" +
        "123456789012345678901234567890" +
        "12345678901234567890123456789012345678901234567890" +
        "12345678901234567890123456789012345678901234567890";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.name.max"));
        done();
      });
    });

    /*****************************************************************/
    it("add() : domain notEmpty", function(done) {

      handler.params.name = "dac";
      handler.params.domain = "";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.domain.min"));
        done();
      });
    });

    /*****************************************************************/
    it("domain len", function(done) {

      handler.params.domain = "" +
        "123456789012345678901234567890" +
        "12345678901234567890123456789012345678901234567890" +
        "12345678901234567890123456789012345678901234567890";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.domain.max"));
        done();
      });
    });

    /*****************************************************************/
    it("type notEmpty", function(done) {

      handler.params.domain = now;
      handler.params.type = "";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.type.min"));
        done();
      });
    });

    /*****************************************************************/
    it("type len", function(done) {

      handler.params.type = "123";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.type.max"));
        done();
      });
    });

    /*****************************************************************/
    it("type len", function(done) {

      handler.params.type = "1";
      company.add(handler, function(err, result) {
        should.not.exist(result);
        err.code.should.equal(400);
        err.message.should.equal(__("js.ctr.check.company.domain"));
        done();
      });
    });
  });


});