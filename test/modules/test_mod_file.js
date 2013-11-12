/**
 * @file 单体测试对象：modules/mod_file.js
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should  = require("should")
  , file    = require("../../modules/mod_file");
/**
 * 测试代码
 */
describe("File Module", function() {
  /**
   * 初始化测试数据
   */
  var fileName = "test_file"
    , filePath = "../SmartCore/test/data/test_file.txt";

  var options = {
//      "metadata": ""
//    , "content_type": ""
  };

  var newFile = {
    valid       : 1
  , createAt    : new Date()
  , createBy    : "sl_say"
  , updateAt    : new Date()
  , updateBy    : "sl_say"
  };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  describe("addFile", function() {
    it("should return OK", function(done) {
      file.addFile("yukari", fileName, filePath, options, newFile, function(err, result) {
//        console.log(err);
//        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getFileInfo", function() {
    it("should return OK", function(done) {
      file.getFileInfo("yukari", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getFile", function() {
    it("should return OK", function(done) {
      file.getFile("yukari", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("getFileInfoList", function() {
    it("should return OK", function(done) {
      file.getFileInfoList("yukari", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("updateFileInfo", function() {
    it("should return OK", function(done) {
      file.updateFileInfo("yukari", "", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("removeFile", function() {
    it("should return OK", function(done) {
      file.removeFile("yukari", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });

  /*****************************************************************/
  describe("total", function() {
    it("should return OK", function(done) {
      file.total("yukari", "", function(err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });
});