/**
 * @file 单体测试对象：models/mod_group.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var should   = require("should")
  , modGroup  = require("../../../coverage/lib/models/mod_group");

describe("models/mod_group.js", function() {

  var date = new Date();
  var gid;

  var data = {
      name         : "lizheng"
    , parent       : "123456"
    , description  : "中名"
    , type         : "1"
    , public       : "1"
    , owners       : ["0", "1"]
    , extend       : {"QQ":"123456789", "birthday": "19850302"}
    , valid        : 1
    , createAt     : date
    , createBy     : "123"
    , updateAt     : date
    , updateBy     : "456"
    };

  /*****************************************************************/
  describe("add()", function() {
    it("correctly create new group", function(done) {

      modGroup.add(null, data, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("name").and.equal("lizheng");
        result.should.have.property("parent").and.equal("123456");
        result.should.have.property("description").and.equal("中名");
        result.should.have.property("type").and.equal("1");
        result.should.have.property("public").and.equal("1");
        result.should.have.property("owners");
        result.owners[0].should.equal("0");
        result.owners[1].should.equal("1");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateAt");
        result.should.have.property("updateBy").and.equal("456");

        gid = result._id;

        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correctly get group", function(done) {

      modGroup.get(null, gid, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("name").and.equal("lizheng");
        result.should.have.property("parent").and.equal("123456");
        result.should.have.property("description").and.equal("中名");
        result.should.have.property("type").and.equal("1");
        result.should.have.property("public").and.equal("1");
        result.should.have.property("owners");
        result.owners[0].should.equal("0");
        result.owners[1].should.equal("1");
        result.should.have.property("extend");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.should.have.property("valid").and.equal(1);
        result.should.have.property("createAt");
        result.should.have.property("createBy").and.equal("123");
        result.should.have.property("updateAt");
        result.should.have.property("updateBy").and.equal("456");

        done();
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("correctly get group count", function(done) {

      modGroup.total(null, {_id: gid}, function(err, count) {

        should.not.exist(err);
        should.exist(count);

        Number(1).should.equal(count);

        done();
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("correctly get group list", function(done) {

      modGroup.add(null, data, function() {

        modGroup.getList(null, {name: "lizheng", parent: "123456", "extend.birthday": "19850302"},
           null, null, null, function(err, result) {

            should.not.exist(err);
            should.exist(result);

            result.length.should.above(1);

            done();
          });
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("correctly update group", function(done) {

      modGroup.update(null, gid, {name: "888", "extend.QQ": "555"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.have.property("name").and.equal("888");
        result.extend.QQ.should.equal("555");

        done();
      });
    });
  });

});
