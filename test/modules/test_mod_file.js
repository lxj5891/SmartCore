/**
 * @file 单体测试对象：modules/mod_file.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should     = require("should")
  , file        = require("../../coverage/modules/mod_file");
/**
 * 测试代码
 */
describe("modules/mod_file.js", function() {
  /**
   * 初始化测试数据
   */
  var fileName = "test_file"
    , filePath = "../SmartCore/test/data/test_file.txt";

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

//  afterEach(function(done) {
//    file.removeFile("yukari",result._id,function(err,result) {
//      should.not.exist(err);
//      should(result).not.eql(null);
//      done();
//    });
//  });

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("addFile()", function() {

    it("should return err when the dbCode is an invalid", function(done) {
      file.addFile("aaaaaaaaa", fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return err when the file options is an invalid", function(done) {
      var options = {
          "metadata": "aaa"
        , "content_type": "aaaa"
        };
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return err when the filePath is an invalid", function(done) {
      var filePath = "aaaa/aaa/aaa.txt";
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, result) {
        should.not.exist(err);
        should(result).not.eql(null);
        result.should.have.property("length").and.eql(40);
        result.should.have.property("chunkSize").and.eql(262144);
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
  describe("getFileInfo()", function() {
    it("should return OK", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.getFileInfo(dbCode, fileInfo._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("length").and.eql(fileInfo.length);
          result.should.have.property("chunkSize").and.eql(fileInfo.chunkSize);
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

    it("should return null when fileId not exists", function(done) {
      file.getFile(dbCode, "6281f1ccb90224882a000001", function(err, result) {
        should.not.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileId exists", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.getFile(dbCode, fileInfo.fileId, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getFileInfoList()", function() {
    it("should return OK when fileId exists", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        var conditions = { valid : 1 };
        file.getFileInfoList(dbCode, conditions, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.length.should.be.above(0);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("updateFileInfo()", function() {
    it("should return OK", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        var updateFile = {
          filename : "updated File"
        };
        file.updateFileInfo(dbCode, fileInfo._id, updateFile, function(err, result) {
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
    it("should return err", function(done) {
      file.removeFile(dbCode, "6281f1ccb90224882a000001", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
        file.removeFile(dbCode, fileInfo._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("fileId").and.eql(fileInfo.fileId);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("should return OK", function(done) {
      file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileInfo) {
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