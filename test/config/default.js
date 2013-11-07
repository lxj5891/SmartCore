
module.exports = {

  // 测试数据库
  "testdb": {
    "host": "mongo"
  , "port": 27017
  , "dbname": "developer"
  , "pool": 5
  },

  // 日志
  "log": {
    "fluent": {
      "enable": "true"
    , "tag": "node"
    , "host": "10.2.8.228"
    , "port": 24224
    , "timeout": 3.0
    }
  }
};
