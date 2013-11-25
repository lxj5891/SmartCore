
/**
 * @file 单体测试对象：core/errors.js
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

require("../../coverage/lib/test").befor();

var should    = require("should")
  , errors    = require("../../coverage/lib/errors");

/**
 * 测试代码
 */
describe("Errors", function() {

  /**
   * 执行测试case
   */
  /*****************************************************************/
  it("BadRequestError", function(done) {

    var error = new errors.BadRequest("err");

    should.exist(error);
    error.code.should.equal(400);
    error.message.should.equal("err");

    done();
  });

  /*****************************************************************/
  it("UnauthorizedError", function(done) {

    var error = new errors.Unauthorized("err");

    should.exist(error);
    error.code.should.equal(401);
    error.message.should.equal("err");

    done();
  });

  /*****************************************************************/
  it("ForbiddenError", function(done) {

    var error = new errors.Forbidden("err");

    should.exist(error);
    error.code.should.equal(403);
    error.message.should.equal("err");

    done();
  });

  /*****************************************************************/
  it("NotFoundError", function(done) {

    var error = new errors.NotFound("err");

    should.exist(error);
    error.code.should.equal(404);
    error.message.should.equal("err");

    done();
  });

  /*****************************************************************/
  it("InternalServerError", function(done) {

    var error = new errors.InternalServer("err");

    should.exist(error);
    error.code.should.equal(500);
    error.message.should.equal("err");

    done();
  });

});