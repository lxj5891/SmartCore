/**
 * @file 单体测试对象：controllers/ctrl_user.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should  = require("should")
  , mock    = require("../../core/mock")
  , context = require("../../core/context")
  , ctrlUser = require("../../controllers/ctrl_user")
  , modGroup = require("../../modules/mod_group");

var userName = new Date().toLocaleString();

function newHandler(uid, body) {

  var res = mock.getRequest();
  var req = mock.getResponse(uid, {}, body || {
      userName    : userName
    , first       : "名"
    , middle      : "中名"
    , last        : "姓"
    , password    : "admin"
    , groups      : []
    , email       : "zli_ray@sina.cn"
    , lang        : "ja"
    , timezone    : "GMT+09:00"
    , status      : 0
    , extend      : {"QQ":"123456789", "birthday": "19850302"}
    });

  var handler = new context().bind(req, res);

  return handler;
}

/**
 * 测试代码
 */
describe("controllers/ctrl_user.js", function() {

  var groupData = {
      name         : "lizheng"
    , parent       : null
    , description  : "中名"
    , type         : "1"
    , public       : "1"
    , owners       : ["0", "1"]
    , extend       : {"QQ":"123456789", "birthday": "19850302"}
    , valid        : 1
    , createAt     : new Date()
    , createBy     : "123"
    , updateAt     : new Date()
    , updateBy     : "456"
    };

  var addedUser;

  describe("add()", function() {

    /*****************************************************************/
    it("correctly add new user", function(done) {

      modGroup.add(null, groupData, function(err, group) {

        var handler = newHandler("12345678");
        handler.params.groups.push(group._id);

        ctrlUser.add(handler, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          // 全字段正确性检查
          should.exist(result._id);
          result.should.have.property("userName").and.equal(userName);
          result.should.have.property("first").and.equal("名");
          result.should.have.property("middle").and.equal("中名");
          result.should.have.property("last").and.equal("姓");
          result.should.have.property("password").and.equal("admin");
          result.should.have.property("groups");
          result.groups[0].should.equal(group._id.toString());
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
          result.should.have.property("createBy").and.equal("12345678");
          result.should.have.property("updateBy").and.equal("12345678");

          addedUser = result;

          done();
        });
      });
    });

    /*****************************************************************/
    it("empty userName", function(done) {

      var handler = newHandler("12345678");
      handler.params.userName = "";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty password", function(done) {

      var handler = newHandler("12345678");
      handler.params.password = "";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty email", function(done) {

      var handler = newHandler("12345678");
      handler.params.email = "";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid email", function(done) {

      var handler = newHandler("12345678");
      handler.params.email = "AAA";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty lang", function(done) {

      var handler = newHandler("12345678");
      handler.params.lang = "";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("not supported lang", function(done) {

      var handler = newHandler("12345678");
      handler.params.lang = "89";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty timezone", function(done) {

      var handler = newHandler("12345678");
      handler.params.timezone = null;

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("conflict userName", function(done) {

      var handler = newHandler("12345678");

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("group not exist", function(done) {

      var handler = newHandler("12345678");
      handler.params.userName = new Date().getTime();
      handler.params.groups = ["5284e5862102f0b801000002"];

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

  });

  describe("update()", function() {

    function newUser() {
      return {
          userName    : "666"
        , first       : "first"
        , middle      : "middle"
        , last        : "last"
        , password    : "password"
        , groups      : []
        , email       : "test@aaa.com"
        , lang        : "en"
        , timezone    : "GMT+08:00"
        , status      : "1"
        , extend      : {"QQ":"55555", "zip": "116621"}
        , valid       : 0
        , createAt    : "6"
        , createBy    : "7"
        , updateAt    : "8"
        , updateBy    : "9"
        };
    }

    /*****************************************************************/
    it("correctly update user", function(done) {

      modGroup.add(null, groupData, function(err, group) {

        var user = newUser();

        var handler = newHandler("44", user);
        handler.params.uid = addedUser._id;
        handler.params.groups = [group._id];

        ctrlUser.update(handler, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          // 全字段正确性检查
          should.exist(result._id);
          result.should.have.property("userName").and.equal(addedUser.userName);
          result.should.have.property("first").and.equal(user.first);
          result.should.have.property("middle").and.equal(user.middle);
          result.should.have.property("last").and.equal(user.last);
          result.should.have.property("password").and.equal(user.password);
          result.should.have.property("groups");
          result.groups.length.should.equal(1);
          result.groups[0].should.equal(group._id.toString());
          result.groups[0].should.not.equal(addedUser.groups[0]);
          result.should.have.property("email").and.equal(user.email);
          result.should.have.property("lang").and.equal(user.lang);
          result.should.have.property("status").and.equal(user.status);
          result.should.have.property("timezone").and.equal(user.timezone);
          result.should.have.property("extend");
          result.extend.QQ.should.equal(user.extend.QQ);
          // result.extend.birthday.should.equal(user.extend.birthday); TODO extend更新时，既存字段被删除掉了
          result.should.have.property("valid").and.equal(1);
          result.should.have.property("createAt");
          result.createAt.getTime().should.equal(addedUser.createAt.getTime());
          result.should.have.property("updateAt");
          result.updateAt.getTime().should.not.equal(addedUser.createAt.getTime());
          result.should.have.property("createBy").and.equal(addedUser.createBy);
          result.should.have.property("updateBy").and.equal("44");

          done();
        });
      });

    });


    /*****************************************************************/
    it("empty email", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.email = null;

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid email", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.email = "AAA";

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty lang", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.lang = "";

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("not supported lang", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.lang = "89";

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty timezone", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.timezone = null;

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("group not exist", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = addedUser._id;
      handler.params.groups = ["5284e5862102f0b801000002"];

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("user not exist", function(done) {

      var user = newUser();

      var handler = newHandler("44", user);
      handler.params.uid = "5284e5862102f0b801000002";

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(404);

        done();
      });
    });

  });

  describe("get()", function() {

    it("correctly get user", function(done) {

      var handler = newHandler("44", {uid: addedUser._id});

      ctrlUser.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        done();
      });
    });
  });

  describe("exist()", function() {

    it("check user exist", function(done) {

      var handler = newHandler("44", {uid: addedUser._id});

      ctrlUser.exist(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(true);

        done();
      });
    });
  });

//  describe("getListByKeywords()", function() {
//
//    var handler = newHandler("12345678");
//
//    var user1 = addedUser;
//    var user2;
//    var user3;
//
//    ctrlUser.add(handler, function(result) {
//
//      user2 = result;
//
//      ctrlUser.add(handler, function(result) {
//
//        user3 = result;
//
//      });
//
//    });
//
//    it("correctly get user list", function(done) {
//
//      var handler = newHandler("44", {uid: addedUser._id});
//
//      ctrlUser.remove(handler, function(err, result) {
//
//        should.not.exist(err);
//        should.exist(result);
//
//        result.should.have.property("valid").and.equal(0);
//
//        done();
//      });
//    });
//  });

  describe("remove()", function() {

    it("correctly remove user", function(done) {

      var handler = newHandler("44", {uid: addedUser._id});

      ctrlUser.remove(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("valid").and.equal(0);

        done();
      });
    });
  });


});