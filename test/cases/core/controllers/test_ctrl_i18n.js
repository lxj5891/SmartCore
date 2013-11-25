/**
 * @file 单体测试对象：controllers/ctrl_i18n.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../../coverage/lib/test").befor();

var should  = require("should")
  , mock    = require("../../../coverage/lib/mock")
  , context = require("../../../coverage/lib/context")
  , i18n    = require("../../../coverage/lib/controllers/ctrl_i18n");

/**
 * 测试代码
 */
describe("controllers/ctrl_i18n.js", function() {

  /**
   * 初始化测试数据
   */
  var res = mock.getRequest()
    , req = mock.getResponse("12345678", {}, {})
    , handler = new context().bind(req, res);

  describe("add()", function() {

    /*****************************************************************/
    it("add new word", function(done) {

      handler.addParams("key", "jp.yukari.myword");
      handler.addParams("value", "我的词条");
      i18n.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        result.should.have.property("lang").and.contain({ en: "我的词条" });

        done();
      });
    });

    /*****************************************************************/
    it("overwrite word", function(done) {

      handler.addParams("key", "jp.yukari.myword");
      handler.addParams("value", "我的词条1");
      i18n.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        result.should.have.property("lang").and.not.contain({ en: "我的词条" });
        result.should.have.property("lang").and.contain({ en: "我的词条1" });

        done();
      });
    });

    /*****************************************************************/
    it("append lang", function(done) {

      handler.addParams("key", "jp.yukari.myword");
      handler.addParams("lang", "zh");
      handler.addParams("value", "我的词条2");
      i18n.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        result.should.have.property("lang").and.contain({ en: "我的词条1" });
        result.should.have.property("lang").and.contain({ zh: "我的词条2" });

        done();
      });
    });

    /*****************************************************************/
    it("spec category", function(done) {

      handler.addParams("key", "jp.yukari.myword");
      handler.addParams("category", "mycategory");
      handler.addParams("lang", "zh");
      handler.addParams("value", "我的词条3");
      i18n.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        result.should.have.property("lang").and.contain({ en: "我的词条1" });
        result.should.have.property("lang").and.contain({ zh: "我的词条3" });
        result.should.have.property("category").and.equal("mycategory");

        done();
      });
    });
  });

  describe("get()", function() {

    /*****************************************************************/
    it("get word", function(done) {

      handler.removeParams("lang");
      handler.addParams("key", "jp.yukari.myword");
      i18n.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal("我的词条1");

        done();
      });
    });

    /*****************************************************************/
    it("get lang word", function(done) {

      handler.addParams("key", "jp.yukari.myword");
      handler.addParams("lang", "zh");
      i18n.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal("我的词条3");

        done();
      });
    });

    /*****************************************************************/
    it("no word", function(done) {

      handler.addParams("key", "jp.yukari.lalala");
      handler.addParams("lang", "zh");
      i18n.get(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);

        result.should.equal("jp.yukari.lalala");

        done();
      });
    });

  });

});