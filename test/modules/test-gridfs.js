var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log");

// jscoverage or original library
var gridfs = process.env['COVER'] 
  ? require('../../cover_modules/gridfs')
  : require('../../modules/gridfs');

describe("GridFS", function() {

  var fid;

  it("test all function", function(done) {

    gridfs.all({metadata: { auth: 'li' }}, 0, 5, function(err, result) {
      // assert.equal(err, null, "Error should be null.");
      // assert.notEqual(result._id, null, "The groupid shall be generated.");
      // assert.equal(result.name, "newGroup", "The group name should be correct.");

console.log(result.length);

      done();
    });
  });

  it("test save function", function(done){
    gridfs.save("app.js", "app.js", {"author": "50d1acb874d5d2648200000b"}, "mytype", function(err, result){

// console.log(err);
console.log(result);
      fid = result._id;
      done();
    });
  });


  it("test delete function", function(done){
    gridfs.delete(fid.toString(), function(err, result){

console.log(result);
      done();
    });
  });

});
