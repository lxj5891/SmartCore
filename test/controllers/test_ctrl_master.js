/**
 * @file 单体测试对象：controllers/ctrl_master.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should  = require("should")
  , master    = require("../../coverage/controllers/ctrl_master");
/**
 * 测试代码
 */
describe("controllers/ctrl_master.js", function() {

  /**
   * 初始化测试数据
   */
  var date = new Date();
  var newMaster = {
      masterCode    : "Company Type"
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

  var handler = {
      uid : "sl_say"
    , params : {
        master : newMaster
      }
    };
  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {

    it("should return OK", function(done) {
      master.add(handler, function(err, result) {
        should.not.exist(err);
        should(result).not.eql(null);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("should return OK ", function(done) {
      master.add(handler, function(err, masterData) {
        handler.params.masterId = masterData._id;
        master.get(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(masterData._id);
          delete handler.params.masterId;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {

    it("should return OK", function(done) {
      master.add(handler, function(err, masterData) {
        handler.params.condition = { valid : 1 };
        master.getList(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          delete handler.params.condition;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {

    it("should return OK", function(done) {
      master.add(handler, function(err, masterData) {
        var updateMaster = {
          masterType : "SmartCode"
        };
        handler.params.masterId = masterData._id;
        handler.params.updateMaster = updateMaster;
        master.update(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(masterData._id);
          result.should.have.property("masterType").and.eql(updateMaster.masterType);
          delete handler.params.masterId;
          delete handler.params.updateMaster;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("remove()", function() {

    it("should return OK", function(done) {
      master.add(handler, function(err, masterData) {
        var updateMaster = {
          masterType : "SmartCode"
        };
        handler.params.masterId = masterData._id;
        handler.params.updateMaster = updateMaster;
        master.remove(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
//          result.should.have.property("_id").and.eql(masterData._id);
          result.should.have.property("valid").and.eql(0);
          delete handler.params.masterId;
          delete handler.params.updateMaster;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {

    it("should return OK", function(done) {
      master.add(handler, function(err, masterData) {
        handler.params.condition = { masterType : masterData.masterType };
        master.total(handler, function(err, result) {
          should.not.exist(err);
          result.should.be.above(0);
          delete handler.params.condition;
          done();
        });
      });
    });
  });
});