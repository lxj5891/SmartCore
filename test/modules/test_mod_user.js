/**
 * @file 单体测试对象：modules/mod_user.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should   = require("should")
  , modUser  = require("../../coverage/modules/mod_user");

if(!process.env.TEST) {
  process.env.TEST = true;
  process.env.NODE_CONFIG_DIR = "../config";
}

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

      modUser.add(data, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.userName.should.equal("lizheng");
        result.first.should.equal("名");
        result.middle.should.equal("中名");
        result.last.should.equal("姓");
        result.password.should.equal("admin");
        result.groups[0].should.equal("0");
        result.groups[1].should.equal("1");
        result.email.should.equal("zli_ray@sina.cn");
        result.lang.should.equal("ja");
        result.status.should.equal("0");
        result.timezone.should.equal("GMT+09:00");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.valid.should.equal(1);
        result.createAt.getTime().should.equal(date.getTime());
        result.createBy.should.equal("123");
        result.updateAt.getTime().should.equal(date.getTime());
        result.updateBy.should.equal("456");

        uid = result._id;

        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correctly get user", function(done) {

      modUser.get(uid, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.userName.should.equal("lizheng");
        result.first.should.equal("名");
        result.middle.should.equal("中名");
        result.last.should.equal("姓");
        result.password.should.equal("admin");
        result.groups[0].should.equal("0");
        result.groups[1].should.equal("1");
        result.email.should.equal("zli_ray@sina.cn");
        result.lang.should.equal("ja");
        result.status.should.equal("0");
        result.timezone.should.equal("GMT+09:00");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.valid.should.equal(1);
        result.createAt.getTime().should.equal(date.getTime());
        result.createBy.should.equal("123");
        result.updateAt.getTime().should.equal(date.getTime());
        result.updateBy.should.equal("456");

        done();
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("correctly get user count", function(done) {

      modUser.total({_id: uid}, function(err, count) {

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

      modUser.add(data, function() {});

      modUser.getList({userName: "lizheng", middle: "中名", "extend.birthday": "19850302"},
        null, null, null, null, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.above(1);

        done();
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("correctly update user", function(done) {

      modUser.update(uid, {userName: "888", "extend.QQ": "555"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.userName.should.equal("888");
        result.extend.QQ.should.equal("555");

        done();
      });
    });
  });

});
