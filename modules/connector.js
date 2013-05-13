
var Mongodb = require('mongodb')
  , Db = Mongodb.Db
  , Server = Mongodb.Server
  , ObjectID = Mongodb.ObjectID
  , conf = process.env.TEST ? require('config').testdb : require('config').db;

/**
 *
 */
var ServerOptions = {
    auto_reconnect: false
  , poolSize: 2
  , socketOptions: {
        timeout: 0
      , noDelay: true
      , keepAlive: 0
      }
    };

/**
 *
 */
var DbOptions = {
    native_parser: false
  , retryMiliSeconds: 5000
  , strict: true
  , w: 1
  };

/**
 *
 */
function Connector(config, serveroption, dboption) {
  this.connector = new Db(
      config.dbname
    , new Server(config.host, config.port, serveroption)
    , dboption);

  var self = this;
  this.connector.open(function(err, db){
    self.db = db;
    self.err = err;
  });
}

Connector.prototype.id = function(id) {
  if (id instanceof ObjectID) {
    return id;
  }
  
  return new Object(id);
};

module.exports = new Connector(conf, ServerOptions, DbOptions);

