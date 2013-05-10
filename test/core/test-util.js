
var tools = require('../../core/util');

exports.testIsHash = function(test) {
    
  test.ok(!tools.isHash(1));
  test.ok(!tools.isHash("1"));
  test.ok(!tools.isHash(new Date()));
  test.ok(!tools.isHash(new Array()));
  test.ok(!tools.isHash([]));
  test.ok(tools.isHash({a:1}));
  test.ok(!tools.isHash());
  test.ok(!tools.isHash(null));  

  test.done();
};

exports.testUnindentJson = function(test) {

  // 测试数据
  var dt = new Date();
  var obj = {
      a: 1
    , b: 2
    , c: {
        c1: 3
      , c2: 4
      , c3: 5
      , c4: {
          c41: 6
        , c42: 7
      }
    }
    , d: {
      d1: 8
    }
    , e: [9, 10]
    , f: {
      f1: {
          f11: "a"
        , f12: [
            {f121: 11}
          , {f122: 12}
        ]
      }
    }
    , g: dt
    , h: null
  }

  var result = {};
  tools.unindentJson(null, obj, result);

  test.equal(1, result["a"]);
  test.equal(3, result["c.c1"]);
  test.equal(9, result["e.0"]);
  test.equal(11, result["f.f1.f12.0.f121"]);
  test.equal(dt, result["g"]);

  test.done();
};