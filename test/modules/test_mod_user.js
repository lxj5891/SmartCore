/**
 * @file 单体测试对象：modules/mod_user.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should   = require("should")
  , util  = require("../../core/util")
  , modUser  = require("../../coverage/modules/mod_user");

describe("modules/mod_user.js", function() {

  var date = new Date();
  var uid;

  var data = {
      userName    : "lizheng"
    , first       : "名"
    , middle      : "中名"
    , last        : "姓"
    , password    : "admin"
    , groups      : ["0", "1"]
    , email       : "zli_ray@sina.cn"
    , lang        : "ja"
    , timezone    : "GMT+09:00"
    , status      : 0
    , extend      : {"QQ":"123456789", "birthday": "19850302"}
    , valid       : 1
    , createAt    : date
    , createBy    : "123"
    , updateAt    : date
    , updateBy    : "456"
    };

  /*****************************************************************/
  describe("add()", function() {
    it("correctly create new user", function(done) {

      data.userName = util.randomGUID8();

      modUser.add(null, data, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("userName").and.equal(data.userName);
        result.should.have.property("first").and.equal("名");
        result.should.have.property("middle").and.equal("中名");
        result.should.have.property("last").and.equal("姓");
        result.should.not.have.property("password");
        result.should.have.property("groups");
        result.groups[0].should.equal("0");
        result.groups[1].should.equal("1");
        result.should.have.property("email").and.equal("zli_ray@sina.cn");
        result.should.have.property("lang").and.equal("ja");
        result.should.have.property("status").and.equal("0");
        result.should.have.property("timezone").and.equal("GMT+09:00");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("updateAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateBy").and.equal("456");

        uid = result._id;

        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correctly get user", function(done) {

      modUser.get(null, uid, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("userName");
        result.should.have.property("first").and.equal("名");
        result.should.have.property("middle").and.equal("中名");
        result.should.have.property("last").and.equal("姓");
        result.should.not.have.property("password");
        result.should.have.property("groups");
        result.groups[0].should.equal("0");
        result.groups[1].should.equal("1");
        result.should.have.property("email").and.equal("zli_ray@sina.cn");
        result.should.have.property("lang").and.equal("ja");
        result.should.have.property("status").and.equal("0");
        result.should.have.property("timezone").and.equal("GMT+09:00");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("updateAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateBy").and.equal("456");

        done();
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("correctly get user count", function(done) {

      modUser.total(null, {_id: uid}, function(err, count) {

        should.not.exist(err);
        should.exist(count);

        Number(1).should.equal(count);

        done();
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("correctly get user list", function(done) {

      data.userName = new Date().getTime();

      modUser.add(null, data, function() {});

      modUser.getList(null, {middle: "中名", "extend.birthday": "19850302"},
        null, null, null, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.above(1);
        result[0].should.not.have.property("password");

        done();
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("correctly update user", function(done) {

      var userName = util.randomGUID8();

      modUser.update(null, uid, {userName: userName, "extend.QQ": "555"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("userName").and.equal(userName);
        result.should.have.property("extend");
        result.extend.QQ.should.equal("555");
        result.should.not.have.property("password");

        done();
      });
    });
  });

});
