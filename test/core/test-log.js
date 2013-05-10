
var log = require('../../core/log');

exports.testDebug = function(test) {
  test.equal('abc', 'abc');
  //test.expect(1);
  test.ok(true, "this assertion should pass")
  test.done();
};

exports.testInfo = function(test) {
  log.out('info', '中文');
  test.equal(2, 2);
  test.done();
};

exports.testGroup = {
  setUp: function (callback) {
    log.out('info', 'setUp');
    this.foo = 'bar';
    callback();
  },
  tearDown: function (callback) {
    log.out('info', 'tearDown');
    callback();
  },
  test1: function (test) {
    test.equals(this.foo, 'bar');
    test.done();
  },
  test2: function (test) {
    test.equals(this.foo, 'bar');
    test.done();
  }
};