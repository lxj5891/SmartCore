var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log");

// jscoverage or original library
var fulltextsearch = process.env['COVER'] 
  ? require('../../cover_modules/mod_fulltextsearch')
  : require('../../modules/mod_fulltextsearch');

describe("FullTextSearch", function() {


  var operationDate = new Date()
    , fid
    , newData = {
        "type": "newData"
      , "target": "1"
      , "word": "bbb"
      , "lang": "chinese"
      , "count": 39
      , "createby": "li"
      , "createat": operationDate
    };

  it("test create function", function(done) {

    fulltextsearch.create(newData, function(err, result) {

      done();
    });
  });

  it("test search function", function(done) {

    fulltextsearch.search(["bb", "aa"], "chinese", 0, 2, function(err, result) {

console.log(result);

      done();
    });
  });

});