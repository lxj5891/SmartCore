
/**
 * @file 单体测试对象：core/i18n.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../core/test").befor();

var should    = require("should")
  , ctrl      = require("../../controllers/ctrl_i18n")
  , context   = require("../../core/context")
  , mock      = require("../../core/mock")
  , i18n      = require("../../core/i18n");

/**
 * 测试代码
 */
describe("Context", function() {

  /**
   * 初始化测试数据
   */
  var key = "jp.yukari.myword"
    , category = "mycategory"
    , word = "我的词条3 - %s : %d : %j"
    , req = mock.getResponse("12345678", {}, {});

  describe("init()", function() {

    /*****************************************************************/
    it("insert test data", function(done) {

      var handler = new context().bind(req, mock.getRequest());
      handler.addParams("key", key);
      handler.addParams("category", category);
      handler.addParams("lang", "zh");
      handler.addParams("value", word);

      ctrl.add(handler, function(err, result) {

        should.not.exist(err);
        should.exist(result);
        done();
      });
    });

    /*****************************************************************/
    it("cache words", function(done) {
      req.session.user.lang = "zh";
      i18n.init(req, category, function(cache) {

        cache.should.include({ "jp.yukari.myword": "我的词条3 - %s : %d : %j" });
        done();
      });
    });

  });

  describe("__()", function() {

    /*****************************************************************/
    it("get phrase", function(done) {

      req.session.user.lang = "zh";
      var phrase = i18n.__(key);
      phrase.should.equal("我的词条3 - %s : %d : %j");

      phrase = i18n.__(key, "lalala");
      phrase.should.equal("我的词条3 - lalala : %d : %j");

      phrase = i18n.__(key, "lalala", 10);
      phrase.should.equal("我的词条3 - lalala : 10 : %j");

      phrase = i18n.__(key, "lalala", 10, {a: "a"});
      phrase.should.equal("我的词条3 - lalala : 10 : {\"a\":\"a\"}");

      done();
    });

  });
});

