
/**
 * @file 单体测试对象：core/context.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var should    = require("should")
  , log       = require("../../coverage/core/log")
  , context   = require("../../coverage/core/context");

/**
 * 测试代码
 */
describe("Context", function() {

  /**
   * 初始化测试数据
   */
  var RequestMock = function() {};
  RequestMock.prototype.send = function(code, content) {
    log.debug(code);
    log.debug(content);
  };
  RequestMock.prototype.contentType = function(type) {
    log.debug(type);
  };

  var res = new RequestMock()
    , req = {
      session: {
        user: {
          _id: "xxxx1234"
        , companycode: "12345678"
        }
      }
    , query: {
        args1: "1"
      , args2: "2"
      , args3: "3"
      }
    , body: {
        args4: "4"
      , args5: "5"
      , args6: "6"
      }
    };

  /**
   * 执行测试case
   */
  /*****************************************************************/
  it("bind", function(done) {

    var instance = new context().bind(req, res);

    should.exist(instance);
    done();
  });

  /*****************************************************************/
  it("pitch", function(done) {

    var instance = new context().bind(req, res);
    instance.pitch({code: 1, message: "message"});

    should.exist(instance);
    done();
  });

  /*****************************************************************/
  it("addParams", function(done) {

    var instance = new context().bind(req, res);

    instance.addParams("attr1key", "attr1key");
    instance.params.should.include({attr1key: "attr1key"});

    instance.addParams("attr2key", "attr2key");
    instance.params.should.include({attr1key: "attr1key"});
    instance.params.should.include({attr2key: "attr2key"});

    done();
  });

  /*****************************************************************/
  it("removeParams", function(done) {

    var instance = new context().bind(req, res);

    instance.addParams("attr1key", "attr1key");
    instance.addParams("attr2key", "attr2key");
    instance.removeParams("attr1key");
    instance.params.should.not.include({attr1key: "attr1key"});
    instance.params.should.include({attr2key: "attr2key"});

    done();
  });

  /*****************************************************************/
  it("params", function(done) {

    var instance = new context().bind(req, res);

    instance.params.should.include({args1: "1"});
    instance.params.should.include({args4: "4"});

    instance = new context().bind({}, res);
    should.exist(instance.params);

    done();
  });

  /*****************************************************************/
  it("uid", function(done) {

    var instance = new context().bind(req, res);

    should.exist(instance);
    instance.uid.should.equal("xxxx1234");

    done();
  });

  /*****************************************************************/
  it("code", function(done) {

    var instance = new context().bind(req, res);

    should.exist(instance);
    instance.code.should.equal("12345678");

    done();
  });

  /*****************************************************************/
  it("user", function(done) {

    var instance = new context().bind(req, res);

    should.exist(instance);
    instance.user.should.include({_id: "xxxx1234"});

    done();
  });

});

