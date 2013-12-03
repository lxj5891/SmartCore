module.exports = {

  "db": {
      "host": "mongo"
    , "port": 27017
    , "dbname": "smartcore"
    , "prefix": "sc"
    , "schema": {
        "User": "Users"
      }
    , "pool": 5
    }

  , "testdb": {
      "host": "mongo"
    , "port": 27017
    , "dbname": "developer"
    , "pool": 5
    }

  , "mail": {
      "service": "Gmail"
    , "auth": {
        "user": "smart@gmail.com"
      , "pass": "smart"
      }
    }
  
  , "app": {
      "port": 3000
    , "views": "app/template"
    , "public": "/app/public"
    , "cookieSecret": "smartcore"
    , "sessionSecret": "smartcore"
    , "sessionKey": "smartcore.sid"
    , "sessionTimeout": 720 // 24 * 30 一个月
    , "tmp": "/tmp"
    , "hmackey": "smartcore"
    , "i18n": {
        "cache": "memory"
      , "lang": "zh"
      , "category": "yukari"
      }
    , "ignoreAuth": [

        "/"
      , "/login"
        // 静态资源
      , "^\/stylesheets"
      , "^\/javascripts"
      , "^\/vendor"
      , "^\/images"
      , "^\/video"

        // 登陆，注册相关
      , "^\/$"
      , "^\/simplelogin.*"
      , "^\/simplelogout.*"
      , "^\/login.*"
      , "^\/register.*"
      ]
    }

  , "log": {
      "fluent": {
        "enable": "false"
      , "tag": "node"
      , "host": "10.2.8.228"
      , "port": 24224
      , "timeout": 3.0
      }
    }

  , "mq": {
      "host": "mq"
    , "port": 5672
    , "user": "guest"
    , "password": "guest"
    , "queue_join": "smartJoin"
    , "queue_apn": "smartApn"
    , "queue_thumb": "smartThumb"
    , "maxListeners": 0
    }
  };
