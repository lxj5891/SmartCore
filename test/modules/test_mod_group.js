/**
 * @file 单体测试对象：modules/mod_user.js
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should   = require("should")
  , modGroup  = require("../../coverage/modules/mod_group");

if(!process.env.TEST) {
  process.env.TEST = true;
  process.env.NODE_CONFIG_DIR = "../config";
}

describe("modules/mod_group.js", function() {

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

      modGroup.add(data, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.name.should.equal("lizheng");
        result.parent.should.equal("123456");
        result.description.should.equal("中名");
        result.type.should.equal("1");
        result.public.should.equal("1");
        result.owners[0].should.equal("0");
        result.owners[1].should.equal("1");
        result.extend.QQ.should.equal("123456789");
        result.extend.birthday.should.equal("19850302");
        result.valid.should.equal(1);
        result.createAt.getTime().should.equal(date.getTime());
        result.createBy.should.equal("123");
        result.updateAt.getTime().should.equal(date.getTime());
        result.updateBy.should.equal("456");

        gid = result._id;

        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("correctly get group", function(done) {

      modGroup.get(gid, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.name.should.equal("lizheng");
        result.parent.should.equal("123456");
        result.description.should.equal("中名");
        result.type.should.equal("1");
        result.public.should.equal("1");
        result.owners[0].should.equal("0");
        result.owners[1].should.equal("1");
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
    it("correctly get group count", function(done) {

      modGroup.total({_id: gid}, function(err, count) {

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

      modGroup.add(data, function() {});

      modGroup.getList({name: "lizheng", parent: "123456", "extend.birthday": "19850302"},
        "_id name parent type extend.QQ", null, null, null, function(err, result) {

          should.not.exist(err);
          should.exist(result);

          result.length.should.above(1);

          should.exist(result[0]._id);
          should.exist(result[0].name);
          should.exist(result[0].parent);
          should.exist(result[0].type);
          should.exist(result[0].extend.QQ);

          should.not.exist(result[0].owners);
          should.not.exist(result[0].updateAt);

          done();
        });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("correctly update group", function(done) {

      modGroup.update(gid, {name: "888", "extend.QQ": "555"}, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.name.should.equal("888");
        result.extend.QQ.should.equal("555");

        done();
      });
    });
  });

});
