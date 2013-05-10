var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log");

// jscoverage or original library
var fulltextsearch = process.env['COVER'] 
  ? require('../../cover_modules/ctrl_fulltextsearch')
  : require('../../controllers/ctrl_fulltextsearch');

describe("FullTextSearch", function() {

  it("test create function", function(done) {


    fulltextsearch.create("a1", "1", "a", [{"word":"a1", "count":1}, {"word":"a2", "count":1}], function(err, result) {

console.log(result);
      done();
    });
  });


});