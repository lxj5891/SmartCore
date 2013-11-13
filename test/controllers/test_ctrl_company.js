/**
 * @file 单体测试对象：controllers/ctrl_company.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should  = require("should")
  , mock    = require("../../core/mock")
  , context = require("../../core/context")
  , company = require("../../coverage/controllers/ctrl_company");

/**
 * 测试代码
 */
describe("Company Controllers", function() {

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

  /*****************************************************************/
  it("add", function(done) {
    company.add(handler, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      // 全字段正确性检查
      should.exist(result._id);
      should.exist(result.code);
      result.name.should.equal("dac");
      result.domain.should.equal(now);
      result.type.should.equal("1");
      result.extend.address.should.equal("liaoning");
      result.extend.tel.should.equal("0411-12345678");
      result.creator.should.equal("12345678");
      should.exist(result.createAt);
      result.updater.should.equal("12345678");
      should.exist(result.updateAt);

      done();
    });
  });

  /*****************************************************************/
  it("add : code not empty", function(done) {

    handler.params.code = "code";
    company.add(handler, function(err, result) {
      should.not.exist(result);
      err.code.should.equal(400);
      err.message.should.equal(__("js.ctr.check.company.code.min"));
      done();
    });
  });

  /*****************************************************************/
  it("add : name notEmpty", function(done) {

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
  it("add : name len", function(done) {

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
  it("add : domain notEmpty", function(done) {

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
  it("add : domain len", function(done) {

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
  it("add : type notEmpty", function(done) {

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
  it("add : type len", function(done) {

    handler.params.type = "123";
    company.add(handler, function(err, result) {
      should.not.exist(result);
      err.code.should.equal(400);
      err.message.should.equal(__("js.ctr.check.company.type.max"));
      done();
    });
  });

  /*****************************************************************/
  it("add : type len", function(done) {

    handler.params.type = "1";
    company.add(handler, function(err, result) {
      should.not.exist(result);
      err.code.should.equal(400);
      err.message.should.equal(__("js.ctr.check.company.domain"));
      done();
    });
  });

});