/**
 * @file 单体测试对象：controllers/ctrl_group.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var _          = require("underscore")
  , should     = require("should")
  , mock       = require("../../core/mock")
  , context    = require("../../core/context")
  , constant   = require("../../core/constant")
  , ctrlUser   = require("../../controllers/ctrl_user")
  , ctrlGroup  = require("../../controllers/ctrl_group");

function newUser() {
  return {
      userName    : new Date().toLocaleString()
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

function newGroup() {
  return {
      name         : "lizheng"
    , parent       : null
    , description  : "test group"
    , type         : constant.GROUP_TYPE_DEPARTMENT
    , public       : constant.GROUP_PRIVATE
    , owners       : []
    , extend       : {"QQ":"123456789", "birthday": "19850302"}
    };
}

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

  var addedGroup;

  describe("add()", function() {

    /*****************************************************************/
    it("correctly add new group", function(done) {

      ctrlUser.add(newHandler("123", newUser()), function(err, resultUser) {

        var group = newGroup();
        group.owners.push(resultUser._id.toString());

        ctrlGroup.add(newHandler("123", group), function(err, result) {

          should.not.exist(err);
          should.exist(result);

          should.exist(result._id);
          result.should.have.property("name").and.equal(group.name);
          result.should.have.property("parent");
          result.should.have.property("description").and.equal("test group");
          result.should.have.property("type").and.equal(constant.GROUP_TYPE_DEPARTMENT);
          result.should.have.property("public").and.equal(constant.GROUP_PRIVATE);
          result.should.have.property("owners");
          result.owners.length.should.equal(1);
          result.owners[0].should.equal(resultUser._id.toString());
          result.should.have.property("extend");
          result.extend.QQ.should.equal("123456789");
          result.extend.birthday.should.equal("19850302");
          result.should.have.property("valid").and.equal(1);
          result.should.have.property("createAt");
          result.should.have.property("updateAt");
          result.should.have.property("createBy").and.equal("123");
          result.should.have.property("updateBy").and.equal("123");

          addedGroup = result;

          done();
        });
      });
    });

    /*****************************************************************/
    it("empty name", function(done) {

      var group = newGroup();
      group.name = "";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty type", function(done) {

      var group = newGroup();
      group.type = "";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid type", function(done) {

      var group = newGroup();
      group.type = "9";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("description too long", function(done) {

      var group = newGroup();
      group.description = "";
      for(var i = 0; i < 20; i++) {
        group.description += "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      }

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty public", function(done) {

      var group = newGroup();
      group.public = "";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid public", function(done) {

      var group = newGroup();
      group.public = "9";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid parent", function(done) {

      var group = newGroup();
      group.parent = "528837003ea10edc09000002";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("parent is not department", function(done) {

      var group1 = newGroup();
      group1.type = constant.GROUP_TYPE_OFFICIAL;

      ctrlGroup.add(newHandler("123", group1), function(err1, result1) {

        var group2 = newGroup();
        group2.parent = result1._id.toString();

        ctrlGroup.add(newHandler("123", group2), function(err2, result2) {

          should.exist(err2);
          should.not.exist(result2);

          err2.should.have.property("code").and.equal(400);

          done();
        });
      });
    });

    /*****************************************************************/
    it("invalid owners", function(done) {

      var group = newGroup();
      group.owners = "528837003ea10edc09000002";

      ctrlGroup.add(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

  });

  describe("update()", function() {

    /*****************************************************************/
    it("correctly update group", function(done) {

      var group = {
          name         : "test"
        , parent       : null
        , description  : "666"
        , type         : constant.GROUP_TYPE_DEPARTMENT
        , public       : constant.GROUP_PUBLIC
        , owners       : []
        , extend       : {"QQ":"78952", "birthday": "123"}
        , gid          : addedGroup._id.toString()
        };

      ctrlGroup.update(newHandler("234", group), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        should.exist(result._id);
        result.should.have.property("_id");
        result._id.toString().should.equal(addedGroup._id.toString());
        result.should.have.property("name").and.equal("test");
        result.should.have.property("parent");
        result.should.have.property("description").and.equal("666");
        result.should.have.property("type").and.equal(constant.GROUP_TYPE_DEPARTMENT);
        result.should.have.property("public").and.equal(constant.GROUP_PUBLIC);
        result.should.have.property("owners");
        result.owners.length.should.equal(0);
        result.should.have.property("extend");
        result.extend.QQ.should.equal("78952");
        result.extend.birthday.should.equal("123");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("updateAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateBy").and.equal("234");

        addedGroup = result;

        done();
      });
    });

    /*****************************************************************/
    it("empty name", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.name = "";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty type", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.type = "";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid type", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.type = "9";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("description too long", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.description = "";
      for(var i = 0; i < 20; i++) {
        group.description += "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      }

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("empty public", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.public = "";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid public", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.public = "9";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid parent", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.parent = "528837003ea10edc09000002";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("invalid owners", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.owners = "528837003ea10edc09000002";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

    /*****************************************************************/
    it("group not exist", function(done) {

      var group = newGroup();
      group.gid = "528837003ea10edc09000002";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(404);

        done();
      });
    });

    /*****************************************************************/
    it("type not match", function(done) {

      var group = newGroup();
      group.gid = addedGroup._id.toString();
      group.type = constant.GROUP_TYPE_OFFICIAL;

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

  });


});














