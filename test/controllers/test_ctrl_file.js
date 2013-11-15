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

  var handler = {
    uid : "sl_say"
  , params : {
      files : files
    , code : "yukari"
    }
  };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("add()", function() {
//    var newFile = {
//        name : "test_file"
//      , path : "aaaaaaaaaaaaaaaaaaaa.txt"
//      , type : "text/plain"
//      };
//
//    var files = [];
//    files.push(newFile);
//    handler.params.files = files;
    it("should return err when file not exists", function(done) {
      file.add(handler, function(err, result) {
        should.exist(err);
        should(result).eql([]);
        done();
      });
    });

    it("should return OK", function(done) {
      file.add(handler, function(err, result) {
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
      file.get(handler, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        handler.params.fileInfoId = fileList[0]._id;
        file.get(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(fileList[0]._id);
          delete handler.params.fileInfoId;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getFile()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.getFile(handler, function(err, result) {
        should.not.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        handler.params.fileId = fileList[0].fileId;
        file.getFile(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          delete handler.params.fileId;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("getList()", function() {
    it("should return err", function(done) {
      handler.params.condition = { 1 : 1 };
      file.getList(handler, function(err, result) {
        should.not.exist(err);
        should(result).eql([]);
        delete handler.params.condition;
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        handler.params.condition = { valid : 1 };
        file.getList(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.length.should.be.above(3);
          delete handler.params.condition;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("update()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.update(handler, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        var updateFile = {
          filename : "updated File"
        };
        handler.params.fileInfoId = fileList[0]._id;
        handler.params.updateFile = updateFile;
        file.update(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(fileList[0]._id);
          result.should.have.property("filename").and.eql(updateFile.filename);
          delete handler.params.fileInfoId;
          delete handler.params.updateFile;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("updateFile()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.updateFile(handler, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        var updateFile = {
          filename : "updated File"
        };
        handler.params.fileInfoId = fileList[0]._id;
        handler.params.updateFile = updateFile;
        handler.params.fileName = "update_File";
        handler.params.filePath = "./test/data/test_file.txt";
        file.updateFile(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("_id").and.eql(fileList[0]._id);
          result.should.have.property("filename").and.eql(updateFile.filename);
          delete handler.params.fileInfoId;
          delete handler.params.updateFile;
          delete handler.params.fileName;
          delete handler.params.filePath;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("remove()", function() {
    it("should return err when fileInfoid not exists", function(done) {
      file.remove(handler, function(err, result) {
        should.exist(err);
        should(result).eql(null);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        handler.params.fileInfoId = fileList[0]._id;
        file.remove(handler, function(err, result) {
          should.not.exist(err);
          should(result).not.eql(null);
          result.should.have.property("valid").and.eql(0);
          delete handler.params.fileInfoId;
          done();
        });
      });
    });
  });

  /*****************************************************************/
  describe("total()", function() {
    it("should return err", function(done) {
      file.total(handler, function(err, result) {
        should.not.exist(err);
        should(result).eql(0);
        done();
      });
    });

    it("should return OK when fileInfoid exists", function(done) {
      file.add(handler, function(err, fileList) {
        handler.params.condition = { fileName : fileList[0].fileName };
        file.total(handler, function(err, result) {
          should.not.exist(err);
          result.should.be.above(3);
          delete handler.params.condition;
          done();
        });
      });
    });
  });
});