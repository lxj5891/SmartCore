/**
 * @file 单体测试对象：modules/mod_aclink.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should     = require("should")
  , modAcLink  = require("../../coverage/modules/mod_aclink");

var main = new Date().getTime() + "";

describe("modules/mod_aclink.js", function() {

  var data = {
      type    : "1"
    , main    : main
    , subs    : ["permission1", "permission2"]
    };

  describe("add()", function() {
    it("correctly create new link", function(done) {

      modAcLink.add(null, data.type, data.main, data.subs, function(err, result) {

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

      modAcLink.add(null, data.type, data.main, ["permission3", "permission4"], function(err, result) {

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

      modAcLink.exist(null, data.type, data.main, ["permission2", "permission3"], function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal(true);

        done();
      });
    });

    /*****************************************************************/
    it("link should not exist", function(done) {

      modAcLink.exist(null, data.type, data.main, ["ppp"], function(err, result) {

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

      modAcLink.update(null, data.type, data.main, data.subs, function(err, result) {

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
    it("update not exist link", function(done) {

      modAcLink.update(null, "999", data.main, data.subs, function(err, result) {

        should.not.exist(err);
        should.not.exist(result);

        done();
      });
    });

  });

  describe("remove()", function() {

    /*****************************************************************/
    it("remove exist link", function(done) {

      modAcLink.remove(null, data.type, data.main, data.subs, function(err, result) {

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

      modAcLink.get(null, data.type, data.main, function(err, result) {

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



});
