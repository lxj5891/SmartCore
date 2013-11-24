/**
 * @file 单体测试对象：controllers/ctrl_master.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should    = require("should")
  , context   = require("../../core/context")
  , mock      = require("../../core/mock")
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
      masterCode    : "3"
    , masterDescription: "公司类型"
    , masterType : "Smart"
    , masterTrsKey : "trsKey"
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

  var req = mock.getResponse("12345678", {}, {});
  var handler = new context().bind(req, mock.getRequest());
  handler.addParams("uid", "sl_say");
  handler.addParams("master", newMaster);
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
  describe("getByKey()", function() {
    it("should return OK when cache [false] ", function(done) {
      master.add(handler, function(err, masterData) {
        handler.params.masterType = masterData.masterType;
        handler.params.masterCode = masterData.masterCode;
        master.getByKey(handler, function(err, result) {
          should.not.exist(err);
          result.should.have.property("trsKey").and.eql(masterData.masterTrsKey);
          delete handler.params.masterType;
          delete handler.params.masterCode;
          done();
        });
      });
    });

    it("should return undefined when cache [false]", function(done) {
      handler.params.masterType = "not exists";
      handler.params.masterCode = "not exists";
      master.getByKey(handler, function(err, result) {
        should.not.exist(err);
        should(result).eql(undefined);
        delete handler.params.masterType;
        delete handler.params.masterCode;
        done();
      });
    });

    it("should return OK when cache [true] ", function(done) {
      master.add(handler, function(err, masterData) {
        handler.params.masterType = masterData.masterType;
        handler.params.masterCode = masterData.masterCode;
        handler.params.cache = true;
        master.getByKey(handler, function(err, result) {
          should.not.exist(err);
          result.should.have.property("trsKey").and.eql(masterData.masterTrsKey);
          delete handler.params.masterType;
          delete handler.params.masterCode;
          delete handler.params.cache;
          done();
        });
      });
    });

//    it("should return OK when cache [true] ", function(done) {
//      // 从缓存中取值
//      handler.params.masterType = "Smart";
//      handler.params.masterCode = "compType";
//      handler.params.cache = true;
//      console.log(masterUtil.get("Smart", "compType"));
//      master.getByKey(handler, function(err, result) {
//        should.not.exist(err);
//        result.should.have.property("trsKey").and.eql("trsKey");
//        delete handler.params.masterType;
//        delete handler.params.masterCode;
//        delete handler.params.cache;
//        done();
//      });
//    });

    it("should return undefined when cache [true]", function(done) {
      handler.params.masterType = "not exists";
      handler.params.masterCode = "not exists";
      handler.params.cache = true;
      master.getByKey(handler, function(err, result) {
        should.not.exist(err);
        should(result).eql(undefined);
        delete handler.params.masterType;
        delete handler.params.masterCode;
        delete handler.params.cache;
        done();
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
          , masterCode : "UpdateSmart"
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
          masterCode : "removeSmart111"
        };
        handler.params.masterId = masterData._id;
        handler.params.updateMaster = updateMaster;
        master.remove(handler, function(err, result) {
          console.log(result);
          should.not.exist(err);
          should(result).not.eql(null);
//          result.should.have.property("_id").and.eql(masterData._id);
          result.should.have.property("valid").and.eql(0);
          delete handler.params.masterId;
          delete handler.params.updateMaster;
//          delete handler.params.master;
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