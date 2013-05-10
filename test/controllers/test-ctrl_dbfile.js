var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log");

// jscoverage or original library
var dbfile = process.env['COVER'] 
  ? require('../../cover_modules/ctrl_dbfile')
  : require('../../controllers/ctrl_dbfile');

describe("DbFile", function() {

  it("test save function", function(done){

    var files = [
        {name: "app.js", path: "app.js"}
      , {name: "package.json", path: "package.json"}
    ];

    dbfile.save("50d1acb874d5d2648200000b", files, function(err, result){

console.log(err);
console.log(result);
      done();
    });
  });

});
