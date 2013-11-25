/**
 * @file 单体测试对象：controllers/ctrl_user.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var _         = require("underscore")
  , should    = require("should")
  , mock      = require("../../../coverage/lib/mock")
  , context   = require("../../../coverage/lib/context")
  , ctrlUser  = require("../../../coverage/lib/controllers/ctrl_user")
  , modGroup  = require("../../../coverage/lib/models/mod_group");

var userName = new Date().toLocaleString();

function newHandler(uid, body) {

  var res = mock.getRequest();
  var req = mock.getResponse(uid, {}, body);

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

    function newUser() {
      return {
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
        };
    }


    /*****************************************************************/
    it("correctly add new user", function(done) {

      modGroup.add(null, groupData, function(err, group) {

        var handler = newHandler("12345678", newUser());
        handler.params.groups = group._id.toString();

        ctrlUser.add(handler, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          // 全字段正确性检查
          should.exist(result._id);
          result.should.have.property("userName").and.equal(userName);
          result.should.have.property("first").and.equal("名");
          result.should.have.property("middle").and.equal("中名");
          result.should.have.property("last").and.equal("姓");
          result.should.not.have.property("password");
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

      var handler = newHandler("12345678", newUser());
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

      var handler = newHandler("12345678", newUser());
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

      var handler = newHandler("12345678", newUser());
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

      var handler = newHandler("12345678", newUser());
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

      var handler = newHandler("12345678", newUser());
      handler.params.lang = "";

      ctrlUser.add(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty timezone", function(done) {

      var handler = newHandler("12345678", newUser());
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

      var handler = newHandler("12345678", newUser());

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
          uid         : addedUser._id.toString()
        , first       : "234"
        , middle      : "567"
        , last        : "890"
        , password    : "ooo"
        , groups      : []
        , email       : "456@sina.cn"
        , lang        : "zh"
        , timezone    : "GMT+08:00"
        , status      : 0
        , extend      : {"QQ":"646546544", "birthday": "7987987"}
        };
    }


    /*****************************************************************/
    it("correctly update user", function(done) {

      var handler = newHandler("555", newUser());

      ctrlUser.update(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        // 全字段正确性检查
        should.exist(result._id);
        result.should.have.property("userName").and.equal(userName);
        result.should.have.property("first").and.equal("234");
        result.should.have.property("middle").and.equal("567");
        result.should.have.property("last").and.equal("890");
        result.should.not.have.property("password");
        result.should.have.property("groups");
        result.groups.length.should.equal(0);
        result.should.have.property("email").and.equal("456@sina.cn");
        result.should.have.property("lang").and.equal("zh");
        result.should.have.property("status").and.equal("0");
        result.should.have.property("timezone").and.equal("GMT+08:00");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("646546544");
        result.extend.birthday.should.equal("7987987");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("updateAt");
        result.should.have.property("createBy").and.equal("12345678");
        result.should.have.property("updateBy").and.equal("555");

        done();
      });
    });

    /*****************************************************************/
    it("invalid email", function(done) {

      var handler = newHandler("12345678", newUser());
      handler.params.email = "AAA";

      ctrlUser.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(400);

        done();
      });
    });

  });

  describe("exist()", function() {

    /*****************************************************************/
    it("check user exist", function(done) {

      var handler = newHandler("44", {uid: addedUser._id.toString()});

      ctrlUser.exist(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(true);

        done();
      });
    });
  });

  describe("get()", function() {

    /*****************************************************************/
    it("correctly get user", function(done) {

      var handler = newHandler("44", {uid: addedUser._id});

      ctrlUser.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        done();
      });
    });

    /*****************************************************************/
    it("invalid user", function(done) {

      var handler = newHandler("44", {uid: "5288b80f3ce4ee6819000001"});

      ctrlUser.get(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(404);

        done();
      });
    });

  });

  describe("isPasswordRight()", function() {

    /*****************************************************************/
    it("password is right", function(done) {

      var handler = newHandler("44", {userName: userName, password: "ooo"});

      ctrlUser.isPasswordRight(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result._id.toString().should.equal(addedUser._id.toString());
        result.should.not.have.property("password");

        console.log(result);

        done();
      });
    });

    /*****************************************************************/
    it("password is wrong", function(done) {

      var handler = newHandler("44", {userName: userName, password: "123"});

      ctrlUser.isPasswordRight(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("user not exist", function(done) {

      var handler = newHandler("44", {userName: "987654321", password: "123"});

      ctrlUser.isPasswordRight(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(404);

        done();
      });
    });

  });

  describe("getListByKeywords()", function() {

//    var user1 = {
//      userName    : "Fri Nov 15 2013 15:08:07 GMT+0800 (中国 (標準時))"
//      , first       : "first"
//      , middle      : "middle"
//      , last        : "last"
//      , email       : "test@aaa.com"
//      };

    var handler2 = newHandler("12345678", {
        userName    : userName + "1"
      , first       : "2名"
      , middle      : "2中"
      , last        : "2姓"
      , password    : "admin"
      , groups      : []
      , email       : "zli_aaa@sina.cn"
      , lang        : "ja"
      , timezone    : "GMT+09:00"
      , status      : 0
      , extend      : {"QQ":"123456789", "birthday": "19850302"}
      });

    /*****************************************************************/
    it("correctly get user list by intersect conditions", function(done) {

      ctrlUser.add(handler2, function() {
        var condition = {
          "userName": "GMT",
          "realName": "中名",
          "email": "sina.cn",
          "and": true
        };

        var handler = newHandler("44", condition);

        ctrlUser.getListByKeywords(handler, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          result.should.have.property("totalItems").and.above(0);

          _.each(result.items, function(user) {
            user.userName.indexOf("GMT").should.above(0);
            user.middle.indexOf("中名").should.equal(0);
            user.email.indexOf("sina").should.above(0);
            user.should.not.have.property("password");
          });

          done();
        });
      });

    });

    /*****************************************************************/
    it("correctly get user list by union conditions", function(done) {

      var condition = {
        "realName": "2姓2中",
        "email": "ray",
        "and": false
      };

      var handler = newHandler("44", condition);

      ctrlUser.getListByKeywords(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("totalItems").and.above(1);

        done();
      });

    });

    /*****************************************************************/
    it("empty conditions", function(done) {

      var condition = {};

      var handler = newHandler("44", condition);

      ctrlUser.getListByKeywords(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("totalItems").and.above(0);

        done();
      });

    });

    /*****************************************************************/
    it("empty result", function(done) {

      var condition = {
        "realName": "ADRT",
        "email": "uijk",
        "and": true
      };

      var handler = newHandler("44", condition);

      ctrlUser.getListByKeywords(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("totalItems").and.equal(0);

        done();
      });

    });

  });

  describe("remove()", function() {

    /*****************************************************************/
    it("correctly remove user", function(done) {

      var handler = newHandler("44", {uid: addedUser._id.toString()});

      ctrlUser.remove(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("valid").and.equal(0);
        result.should.not.have.property("password");

        done();
      });
    });

    /*****************************************************************/
    it("invalid user", function(done) {

      var handler = newHandler("44", {uid: "5288b80f3ce4ee6819000001"});

      ctrlUser.remove(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.code.should.equal(404);

        done();
      });
    });

  });


});