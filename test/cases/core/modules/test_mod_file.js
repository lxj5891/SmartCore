/**
 * @file 单体测试对象：modules/mod_file.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should     = require("should")
  , conf        = require("config").db
  , file        = require("../../coverage/modules/mod_file");

/**
 * 测试代码
 */
describe("modules/mod_file.js", function() {
  /**
   * 初始化测试数据
   */
  var fileName = "test_file"
    , filePath = "./test/data/test_file.txt";

  var options = {
//      "metadata": ""
//    , "content_type": ""
  };

  var date = new Date();
  var newFile = {
    valid       : 1
  , createAt    : date
  , createBy    : "sl_say"
  , updateAt    : date
  , updateBy    : "sl_say"
  };

  var dbCode = "yukari";

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {

    it("should return err when the dbCode is an invalid", function(done) {
      conf.host = "mongos";
      file.add("aaaaaaaaa", fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        conf.host = "mongo";
        done();
      });
    });

    it("should return err when the file options is an invalid", function(done) {
      var options = {
          "w": -1
        , "wtimeout": 0
        , "fsync": true
        , "journal": true
        };
      file.add(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return err when the filePath is an invalid", function(done) {
      var filePath = "aaaa/aaa/aaa.txt";
      file.add(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.not.exist(err);
        should(result).not.eql(null);
        result.should.have.property("length").and.eql(40);
        result.should.have.property("filename").and.eql(fileName);
        result.should.have.property("contentType").and.eql("binary/octet-stream");
        result.should.have.property("valid").and.eql(1);
        result.should.have.property("createAt").and.eql(date);
        result.should.have.property("createBy").and.eql("sl_say");
        result.should.have.property("updateAt").and.eql(date);
        result.should.have.property("updateBy").and.eql("sl_say");
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("should return OK", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.get(dbCode, fileInfo._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("length").and.eql(fileInfo.length);
          result.should.have.property("filename").and.eql(fileInfo.filename);
          result.should.have.property("contentType").and.eql(fileInfo.contentType);
          result.should.have.property("valid").and.eql(fileInfo.valid);
          result.should.have.property("createAt").and.eql(fileInfo.createAt);
          result.should.have.property("createBy").and.eql(fileInfo.createBy);
          result.should.have.property("updateAt").and.eql(fileInfo.updateAt);
          result.should.have.property("updateBy").and.eql(fileInfo.updateBy);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getInfo()", function() {
    it("should return OK", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.getInfo(dbCode, fileInfo._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("length").and.eql(fileInfo.length);
          result.should.have.property("filename").and.eql(fileInfo.filename);
          result.should.have.property("contentType").and.eql(fileInfo.contentType);
          result.should.have.property("valid").and.eql(fileInfo.valid);
          result.should.have.property("createAt").and.eql(fileInfo.createAt);
          result.should.have.property("createBy").and.eql(fileInfo.createBy);
          result.should.have.property("updateAt").and.eql(fileInfo.updateAt);
          result.should.have.property("updateBy").and.eql(fileInfo.updateBy);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getFile()", function() {

    it("should return err when the dbCode is an invalid", function(done) {
      file.getFile("aaaaaaaaa", "", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return err when the file options is an invalid", function(done) {
      file.getFile(dbCode, "", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });
    it("should return null when fileId not exists", function(done) {
      file.getFile(dbCode, "6281f1ccb90224882a000001", function(err, result) {
        should.not.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileId exists", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.getFile(dbCode, fileInfo.fileId, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("should return OK when fileId exists", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        var conditions = { valid : 1 };
        file.getList(dbCode, conditions, "", "", "", function(err, result) {
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
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        var updateFile = {
          filename : "updated File"
        };
        file.update(dbCode, fileInfo._id, updateFile, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("filename").and.eql(updateFile.filename);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("updateFile()", function() {

    it("should return err when the dbCode is an invalid", function(done) {
//      conf.host = "mongos";
      file.updateFile("aaaaaaaaa", "" , "", fileName, filePath, options, function(err, result) {
        should.exist(err);
        should(result).eql(null);
//        conf.host = "mongo";
        done();
      });
    });

    it("should return err when the file options is an invalid", function(done) {
      var options = {
          "w": -1
        , "wtimeout": 0
        , "fsync": true
        , "journal": true
        };
      file.updateFile(dbCode, "" , "", fileName, "1111/sss", options, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        var updateFile = {
          filename : "updated File"
        };
        file.updateFile(dbCode, fileInfo._id, updateFile, fileName, filePath, options, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("filename").and.eql(updateFile.filename);
          done();
        });
      });
    });
  });
  /*****************************************************************/
  describe("removeFile()", function() {

    it("should return OK", function(done) {
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.remove(dbCode, fileInfo._id, function(err, result) {
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
      file.add(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.total(dbCode, {}, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.be.above(0);
          done();
        });
      });
    });
  });
});