var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log")
  , process = require("../../core/process");

describe("Process", function() {

  it("test updateFulltextIndex function", function(done) {

    process.updateFulltextIndex("1", "1", "在导航栏里的快速搜索", function(err, result) {

      done();
    });
  });

});