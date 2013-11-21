
module.exports = {

  "app": {

    /**
     * 多过语言关联设定
     */
    i18n: {
      "cache": "memory"
    , "lang": "zh"
    , "category": "smartcore"
    }
  },

  /**
   * 测试数据库连接信息
   */
  "testdb": {
    "host": "mongo"
  , "port": 27017
  , "dbname": "developer"
  , "pool": 2

    /**
     * 默认的collection名称前面会自动添加prefix
     * 如果需要指定自定义的名称，则可以在schema里明确指出
     */
  , "prefix": "my"
  , "schema": {
      "Test1": "HelloTest1"
    }
  },

  /**
   * 日志
   */
  "log": {

    /**
     * 将应用程序日志输出到fluent的设定信息
     */
    "fluent": {
      "enable": "true"
    , "tag": "node"
    , "host": "10.2.8.228"
    , "port": 24224
    , "timeout": 3.0
    }
  }
};
