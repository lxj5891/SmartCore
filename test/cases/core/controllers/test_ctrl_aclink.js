/**
 * @file 单体测试对象：controllers/ctrl_aclink.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var should     = require("should")
  , mock       = require("../../../coverage/lib/mock")
  , context    = require("../../../coverage/lib/context")
  , ctrlUser   = require("../../../coverage/lib/controllers/ctrl_user")
  , ctrlAclink = require("../../../coverage/lib/controllers/ctrl_aclink");

/**
 * 测试代码
 */
describe("controllers/ctrl_aclink.js", function() {

  function newHandler(uid, body) {

    var res = mock.getRequest();
    var req = mock.getResponse(uid, {}, body);

    var handler = new context().bind(req, res);

    return handler;
  }

  var main = new Date().getTime() + "";

  var data = {
      type    : "1"
    , main    : main
    , subs    : ["permission1", "permission2"]
    };

  describe("add()", function() {
    it("correctly create new link", function(done) {

      var handler = newHandler("123", data);

      ctrlAclink.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("type").and.equal("1");
        result.should.have.property("main").and.equal(main);
        result.should.have.property("subs");
        result.subs.length.should.equal(2);
        result.subs[0].should.equal("permission1");
        result.subs[1].should.equal("permission2");

        done();
      });
    });

    /*****************************************************************/
    it("correctly add subs to exist link", function(done) {

      data.subs = ["permission3", "permission4"];

      var handler = newHandler("123", data);

      ctrlAclink.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("type").and.equal("1");
        result.should.have.property("main").and.equal(main);
        result.should.have.property("subs");
        result.subs.length.should.equal(4);
        result.subs[0].should.equal("permission1");
        result.subs[1].should.equal("permission2");
        result.subs[2].should.equal("permission3");
        result.subs[3].should.equal("permission4");

        done();
      });
    });

  });

  describe("exist()", function() {

    /*****************************************************************/
    it("link should exist", function(done) {

      data.subs = ["permission2", "permission3"];

      var handler = newHandler("123", data);

      ctrlAclink.exist(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(true);

        done();
      });
    });

    /*****************************************************************/
    it("link should not exist", function(done) {

      data.subs = ["permission6"];

      var handler = newHandler("123", data);

      ctrlAclink.exist(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(false);

        done();
      });
    });

  });

  describe("update()", function() {

    /*****************************************************************/
    it("update exist link", function(done) {

      data.subs = ["permission6", "permission7"];

      var handler = newHandler("123", data);

      ctrlAclink.update(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("type").and.equal("1");
        result.should.have.property("main").and.equal(main);
        result.should.have.property("subs");
        result.subs.length.should.equal(2);
        result.subs[0].should.equal("permission6");
        result.subs[1].should.equal("permission7");

        done();
      });
    });

    /*****************************************************************/
    it("update not exist link", function(done) {

      var data2 = {
          type    : "1"
        , main    : "67890"
        , subs    : ["permission1", "permission2"]
        };

      var handler = newHandler("123", data2);

      ctrlAclink.update(handler, function(err, result) {

        should.exist(err);
        should.not.exist(result);

        done();
      });
    });

  });

  describe("remove()", function() {

    /*****************************************************************/
    it("remove exist link", function(done) {

      var data2 = {
          type    : "1"
        , main    : main
        , subs    : ["permission6", "permission7"]
        };

      var handler = newHandler("123", data2);

      ctrlAclink.remove(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("type").and.equal("1");
        result.should.have.property("main").and.equal(main);
        result.should.have.property("subs");
        result.subs.length.should.equal(0);

        done();
      });
    });

  });

  describe("get()", function() {

    /*****************************************************************/
    it("get link", function(done) {

      var data2 = {
          type    : "1"
        , main    : main
        };

      var handler = newHandler("123", data2);

      ctrlAclink.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("type").and.equal("1");
        result.should.have.property("main").and.equal(main);
        result.should.have.property("subs");
        result.subs.length.should.equal(0);

        done();
      });
    });

  });

  describe("hasPermission()", function() {

    var uid;

    /*****************************************************************/
    it("has permission", function(done) {

      var userData = {
          userName    : (new Date().getTime())
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

      var handler1 = newHandler("123", userData);

      ctrlUser.add(handler1, function(err, user) {

        var linkData = {
            type    : "1"
          , main    : user._id.toString()
          , subs    : ["p1", "p2"]
          };

        uid = user._id.toString();

        var handler2 = newHandler("123", linkData);

        ctrlAclink.add(handler2, function() {

          linkData = {
              uid          : user._id.toString()
            , permissions  : ["p1", "p2"]
            };

          var handler3 = newHandler("123", linkData);

          ctrlAclink.hasPermission(handler3, function(err, exist) {

            should.not.exist(err);
            exist.should.equal(true);

            done();
          });
        });

      });
    });

    /*****************************************************************/
    it("has not permission", function(done) {

      var linkData = {
        uid: uid,
        permissions: ["p1", "p3"]
      };

      var handler = newHandler("123", linkData);

      ctrlAclink.hasPermission(handler, function(err, exist) {

        should.not.exist(err);
        exist.should.equal(false);

        done();
      });
    });

  });

});