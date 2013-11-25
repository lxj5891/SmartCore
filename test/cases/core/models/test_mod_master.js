/**
 * @file 单体测试对象：models/mod_master.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var should        = require("should")
  , master        = require("../../../coverage/lib/models/mod_master");

/**
 * 测试代码
 */
describe("models/mod_master.js", function() {

  /**
   * 初始化测试数据
   */
  var date = new Date();
  var newMaster = {
      masterCode    : "ModlesType"
    , masterDescription: "公司类型"
    , masterType : "Smart"
    , fieldSet : [
        {
          fieldCode : 0
        , fieldObject : { name : "自营客户" }
        }
      , {
          fieldCode : 1
        , fieldObject : { name : "委托客户" }
        }
      , {
          fieldCode : 2
        , fieldObject : { name : "提案客户" }
        }
      ]
    , valid       : 1
    , createAt    : date
    , createBy    : "sl_say"
    , updateAt    : date
    , updateBy    : "sl_say"
    };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {

    it("should return OK", function(done) {
      master.add(newMaster, function(err, result) {
        should.not.exist(err);
        should(result).not.eql(null);
        result.should.have.property("masterCode").and.eql(newMaster.masterCode);
        result.should.have.property("masterDescription").and.eql(newMaster.masterDescription);
        result.should.have.property("masterType").and.eql(newMaster.masterType);
        result.should.have.property("valid").and.eql(newMaster.valid);
        result.should.have.property("createAt").and.eql(newMaster.createAt);
        result.should.have.property("createBy").and.eql(newMaster.createBy);
        result.should.have.property("updateAt").and.eql(newMaster.updateAt);
        result.should.have.property("updateBy").and.eql(newMaster.updateBy);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        master.get(masterData._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("masterCode").and.eql(masterData.masterCode);
          result.should.have.property("masterDescription").and.eql(masterData.masterDescription);
          result.should.have.property("masterType").and.eql(masterData.masterType);
          result.should.have.property("valid").and.eql(masterData.valid);
          result.should.have.property("createAt").and.eql(masterData.createAt);
          result.should.have.property("createBy").and.eql(masterData.createBy);
          result.should.have.property("updateAt").and.eql(masterData.updateAt);
          result.should.have.property("updateBy").and.eql(masterData.updateBy);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getByKey()", function() {
    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        master.getByKey(masterData.masterType, masterData.masterCode, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        var conditions = { valid : 1 };
        master.getList(conditions, "", "", "", function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.length.should.be.above(0);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        var updateMaster = {
          masterType : "SmartCode"
        };
        master.update(masterData._id, updateMaster, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("masterType").and.eql(updateMaster.masterType);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("remove()", function() {

    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        var removeMaster = {
          masterType : "SmartCode"
        };
        master.remove(masterData._id, removeMaster, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("valid").and.eql(0);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("should return OK", function(done) {
      master.add(newMaster, function(err, masterData) {
        master.total( {}, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.be.above(0);
          done();
        });
      });
    });
  });
});