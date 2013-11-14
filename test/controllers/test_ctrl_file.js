/**
 * @file 单体测试对象：controllers/ctrl_file.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should  = require("should")
  , file    = require("../../coverage/controllers/ctrl_file");
/**
 * 测试代码
 */
describe("controllers/ctrl_file.js", function() {
  /**
   * 初始化测试数据
   */

  var newFile = {
      name : "test_file"
    , path : "./test/data/test_file.txt"
    , type : "text/plain"
    };

  var files = [];
  files.push(newFile);
  files.push(newFile);
  files.push(newFile);
  files.push(newFile);

  var dbCode = "yukari";

  var uid = "sl_say";

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {
    var newFile = {
        name : "test_file"
      , path : "aaaaaaaaaaaaaaaaaaaa.txt"
      , type : "text/plain"
      };

    var files = [];
    files.push(newFile);
    it("should return err when file not exists", function(done) {
      file.add(dbCode, uid, files, function(err, result) {
        should.exist(err);
        should(result).eql([]);
        done();
      });
    });

    it("should return OK", function(done) {
      file.add(dbCode, uid, files, function(err, result) {
        should.not.exist(err);
        should(result).not.eql(null);
        result.length.should.eql(4);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("get()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.get(dbCode, "", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        file.get(dbCode, fileList[0]._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(fileList[0]._id);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getFile()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.getFile(dbCode, "", function(err, result) {
        should.not.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        file.getFile(dbCode, fileList[0].fileId, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("should return err", function(done) {
      file.getList(dbCode, { 1 : 1 }, function(err, result) {
        should.not.exist(err);
        should(result).eql([]);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        file.getList(dbCode, { valid : 1 }, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.length.should.be.above(3);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.update(dbCode, "", "", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        var updateFile = {
          filename : "updated File"
        };
        file.update(dbCode, fileList[0]._id, updateFile, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(fileList[0]._id);
          result.should.have.property("filename").and.eql(updateFile.filename);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("remove()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.remove(dbCode, "", function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        file.remove(dbCode, fileList[0]._id, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("fileId").and.eql(fileList[0].fileId);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("should return err", function(done) {
      file.total(dbCode, { 1 : 1 }, function(err, result) {
        should.not.exist(err);
        should(result).eql(0);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(dbCode, uid, files, function(err, fileList) {
        file.total(dbCode, { fileName : fileList[0].fileName }, function(err, result) {
          should.not.exist(err);
          result.should.be.above(3);
          done();
        });
      });
    });
  });
});