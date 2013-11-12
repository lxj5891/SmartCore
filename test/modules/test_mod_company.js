/**
 * @file 单体测试对象：modules/mod_company.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should  = require("should")
  , company = require("../../coverage/modules/mod_company");

/**
 * 测试代码
 */
describe("Company Module", function() {

  /**
   * 初始化测试数据
   */
  var id = ""
    , code = ""
    , data = {
      name        : "4"
    , domain      : "1"
    , type        : "2"
    , extend      : { mail: "test@dac.com", kana: "かな" }
    , valid       : 1
    , createAt    : new Date()
    , creator     : "8"
    , updateAt    : new Date()
    , updater     : "9"
    };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  it("add", function(done) {

    company.add(data, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      should.exist(result._id);
      should.exist(result.code);
      result.name.should.equal("4");
      result.domain.should.equal("1");
      result.type.should.equal("2");
      result.extend.mail.should.equal("test@dac.com");
      result.valid.should.equal(1);
      result.creator.should.equal("8");
      should.exist(result.createAt);
      result.updater.should.equal("9");
      should.exist(result.updateAt);

      id = result._id;
      code = result.code;
      done();
    });
  });

  /*****************************************************************/
  it("getList", function(done) {

    company.getList({name: "4"}, 0, 10, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.length.should.above(1);
      done();
    });
  });

  /*****************************************************************/
  it("getByDomain", function(done) {

    company.getByDomain("1", function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.domain.should.equal("1");
      done();
    });
  });

  /*****************************************************************/
  it("getByCode", function(done) {

    company.getByCode(code, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.domain.should.equal("1");
      done();
    });
  });

  /*****************************************************************/
  it("get", function(done) {

    company.get(id, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.domain.should.equal("1");
      done();
    });
  });

  /*****************************************************************/
  it("update", function(done) {

    company.update(id, {domain: "11"}, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.domain.should.equal("11");
      done();
    });
  });

  /*****************************************************************/
  it("total", function(done) {

    company.total({"code": code}, function(err, result) {

      should.not.exist(err);
      should.exist(result);

      result.should.equal(1);
      done();
    });
  });

});
