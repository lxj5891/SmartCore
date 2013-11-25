/**
 * @file 单体测试对象：controllers/ctrl_group.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var async      = require("async")
  , should     = require("should")
  , mock       = require("../../../coverage/lib/mock")
  , context    = require("../../../coverage/lib/context")
  , constant   = require("../../../coverage/lib/constant")
  , util       = require("../../../coverage/lib/util")
  , ctrlUser   = require("../../../coverage/lib/controllers/ctrl_user")
  , ctrlGroup  = require("../../../coverage/lib/controllers/ctrl_group");

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
describe("controllers/ctrl_group.js", function() {

  var addedGroup;

  describe("add()", function() {

    /*****************************************************************/
    it("correctly add new group", function(done) {

      var user = {
          userName    : util.randomGUID8()
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

      ctrlUser.add(newHandler("123", user), function(err, resultUser) {

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

  });

  describe("exist()", function() {

    /*****************************************************************/
    it("check group exist", function(done) {

      var handler = newHandler("44", {gid: addedGroup._id.toString()});

      ctrlGroup.exist(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(true);

        done();
      });
    });
  });

  describe("get()", function() {

    /*****************************************************************/
    it("correctly get group", function(done) {

      var handler = newHandler("44", {gid: addedGroup._id.toString()});

      ctrlGroup.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("_id");
        result._id.toString().should.equal(addedGroup._id.toString());
        result.should.have.property("name").and.equal("lizheng");

        done();
      });
    });

    /*****************************************************************/
    it("invalid group", function(done) {

      var handler = newHandler("44", {gid: "5288b80f3ce4ee6819000005"});

      ctrlGroup.get(handler, function(err, result) {

        should.not.exist(result);
        should.exist(err);

        err.should.have.property("code").and.equal(404);

        done();
      });
    });

  });

  describe("update()", function() {

    /*****************************************************************/
    it("correctly update group", function(done) {

      var group = {
          gid          : addedGroup._id.toString()
        , name         : "456"
        , parent       : null
        , description  : "789"
        , type         : constant.GROUP_TYPE_GROUP
        , public       : constant.GROUP_PUBLIC
        , owners       : ["234"]
        , extend       : {"QQ":"54654", "birthday": "221321"}
        };

      ctrlGroup.update(newHandler("456", group), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        should.exist(result._id);
        result.should.have.property("name").and.equal("456");
        result.should.have.property("parent");
        result.should.have.property("description").and.equal("789");
        result.should.have.property("type").and.equal(constant.GROUP_TYPE_DEPARTMENT);
        result.should.have.property("public").and.equal(constant.GROUP_PUBLIC);
        result.should.have.property("owners");
        result.owners.length.should.equal(1);
        result.owners[0].should.equal("234");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("54654");
        result.extend.birthday.should.equal("221321");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("updateAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateBy").and.equal("456");

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
      group.public = "9";

      ctrlGroup.update(newHandler("123", group), function(err, result) {

        should.exist(err);
        should.not.exist(result);

        err.should.have.property("code").and.equal(400);

        done();
      });
    });

  });

  var gids = [];

  describe("getSubGroups()", function() {

    /*****************************************************************/
    it("get sub groups non-recursively", function(done) {

      var addGroup = function(parent, cb) {
        var group = newGroup();
        group.parent = parent;
        ctrlGroup.add(newHandler("123", group), function(err, result) {
          gids.push(result._id.toString());
          cb();
        });
      };

      async.waterfall([
        function(cb) {
          addGroup(addedGroup._id.toString(), cb);
        },
        function(cb) {
          addGroup(gids[0], cb);
        },
        function(cb) {
          addGroup(gids[1], cb);
        }
      ], function() {
        ctrlGroup.getSubGroups(newHandler("123", {gid: addedGroup._id.toString()}), function(err, result) {

          should.not.exist(err);
          should.exist(result);

          result.length.should.equal(1);
          result[0].toString().should.equal(gids[0]);

          done();
        });
      });

    });

    /*****************************************************************/
    it("get sub groups recursively", function(done) {

      ctrlGroup.getSubGroups(newHandler("123",
        {gid: addedGroup._id.toString(), recursive: true}), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.equal(3);
        result[0].toString().should.equal(gids[0]);
        result[1].toString().should.equal(gids[1]);
        result[2].toString().should.equal(gids[2]);

        done();
      });

    });

  });

  describe("getUsersInGroup()", function() {

    function newUser() {
      return {
          userName    : (new Date().getTime() + "")
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

    var gids = [];
    var uids = [];

    /*****************************************************************/
    it("correctly get users in group non-recursively", function(done) {

      var addGroup = function(parent, cb) {
        var group = newGroup();
        group.parent = parent;
        ctrlGroup.add(newHandler("123", group), function(err, result) {
          gids.push(result._id.toString());
          var user = newUser();
          user.userName = util.randomGUID8();

          user.groups = [result._id.toString()];
          var handler = newHandler("12345678", user);
          ctrlUser.add(handler, function(err, result) {
            uids.push(result._id.toString());
            cb();
          });

        });
      };

      async.waterfall([
        function(cb) {
          addGroup(null, cb);
        },
        function(cb) {
          addGroup(gids[0], cb);
        },
        function(cb) {
          addGroup(gids[1], cb);
        }
      ], function() {
        ctrlGroup.getUsersInGroup(newHandler("123", {gid: gids[0]}), function(err, result) {

          should.not.exist(err);
          should.exist(result);

          result.should.have.property("totalItems").and.equal(1);
          result.items.length.should.equal(1);
          result.items[0].toString().should.equal(uids[0]);

          done();
        });
      });


    });

    /*****************************************************************/
    it("correctly get users in group recursively", function(done) {

      ctrlGroup.getUsersInGroup(newHandler("123", {gid: gids[0], recursive: true}), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.items.length.should.equal(3);
        result.items[0].should.equal(uids[0]);
        result.items[1].should.equal(uids[1]);
        result.items[2].should.equal(uids[2]);

        done();
      });

    });

  });


  describe("getPath()", function() {

    /*****************************************************************/
    it("correctly get group path", function(done) {

      ctrlGroup.getPath(newHandler("123", {gid: gids[2]}), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.length.should.equal(4);

        result[0].toString().should.equal(addedGroup._id.toString());
        result[1].toString().should.equal(gids[0]);
        result[2].toString().should.equal(gids[1]);
        result[3].toString().should.equal(gids[2]);

        done();
      });

    });

  });

  describe("remove()", function() {

    /*****************************************************************/
    it("correctly remove group", function(done) {

      ctrlGroup.remove(newHandler("123", {gid: gids[2]}), function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("valid").and.equal(0);

        var handler = newHandler("44", {gid: result._id.toString()});

        ctrlGroup.exist(handler, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          result.should.equal(false);

          done();
        });
      });

    });

  });

});














