var assert  = require("assert")
  , _       = require("underscore")
  , user    = require("../../controllers/ctrl_user")
  , moduser = require("../../modules/mod_user");


describe("User Controllers", function() {

  // 测试数据
  var operationDate = new Date()
    , newUser = {
      uid: "smart"
    , password: "smart"
    , email: {
        email1: "smart@smart.com"
      }
    , name: {
        first: "first"
      , last: "last"
      }
    , title: "CEO"
    , address: {
        country: "中国"
      , state: "大连"
      }
    , lang: "CN"
    , createby: "li"
    , createat: operationDate
    , editby: "li"
    , editat: operationDate
    };

  var uids = [];
  it("create test users", function(done) {
    moduser.create(newUser, function(err, result) {uids.push(result._id);});
    newUser.uid = 'smart1';
    moduser.create(newUser, function(err, result) {uids.push(result._id);});
    newUser.uid = 'smart2';
    moduser.create(newUser, function(err, result) {uids.push(result._id);});
    newUser.uid = 'smart3';
    moduser.create(newUser, function(err, result) {uids.push(result._id);});
    newUser.uid = 'smart4';
    moduser.create(newUser, function(err, result) {uids.push(result._id);});
    newUser.uid = 'smart5';
    moduser.create(newUser, function(err, result) {
      uids.push(result._id);
      done();
    });
  });

  /*****************************************************************/
  // 获取一个用户
  it("test getUser function", function(done) {
    user.getUser(uids[0], function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result._id, null, "The userid shall be generated.");
      assert.equal(result.name.first, "first", "The user name should be correct.");
      assert.equal(result.password, null, "The password should be null.");

      done();
    });
  });

  /*****************************************************************/
  // 获取用户一览
  it("test getUserList function", function(done) {

    // 所有参数为空
    user.getUserList(null, null, null, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList("a", "u1", 0, 1, function(err) {
      assert.equal(err, null, "Error should be null.");
    });

    // 测试头字母大小写
    user.getUserList("a", null, null, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList("A", null, null, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });

    // 测试只检索好友
    user.getUserList(null, "u1", null, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });

    // 测试开始位置
    user.getUserList(null, null, -1, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList(null, null, 0, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList(null, null, 1, null, function(err) {
      assert.equal(err, null, "Error should be null.");
    });

    // 测试终了位置
    user.getUserList(null, null, null, -1, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList(null, null, null, 0, function(err) {
      assert.equal(err, null, "Error should be null.");
    });
    user.getUserList(null, null, null, 1, function(err) {
      assert.equal(err, null, "Error should be null.");
    });

    // // 测试XSS
    // user.getUserList("javascript:a", null, null, null, function(err) {
    //   assert.equal(err, null, "Error should be null.");
    //   done();
    // });
    done();
  });

  /*****************************************************************/
  // 获取用户一览
  it("test listByUids function", function(done) {

    user.listByUids(uids, null, null, function(err, result){

      assert.equal(err, null, "Error should be null.");
      assert.equal(result.length, 6, "The user count should be correct.");

      removeTestData(uids);
      done();
    });

    user.listByUids(uids, 3, 1, function(err, result){

      assert.equal(err, null, "Error should be null.");
      assert.equal(result.length, 1, "The user count should be correct.");
      assert.equal(result[0].uid, "smart3", "The uid should be correct.");

      removeTestData(uids);
      done();
    });

  });


});

/**
 * 删除测试用的用户
 */
function removeTestData(uids) {
  _.each(uids, function(uid){
    moduser.remove(uid, function(){});
  });
}

