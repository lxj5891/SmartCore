var sync = require('async')
  , util = require("../core/util")
  , log  = require('../core/log')
  , doc  = require("../modules/mod_document")
  , tmpl = require("../modules/mod_template");

/**
 * 获取文书
 *  文书的定义，以及文书所包含的值
 *
 */
exports.read = function(docid_, callback_){

  sync.waterfall([

    // 获取文书的值
    function(callback) {

      doc.at(docid_, function(doc) {
        callback(null, doc);
      });
    },

    // 获取文书的定义
    function(doc, callback) {

      tmpl.at(doc.template, function(tmpl){
        
        tmpl.docid = doc._id;
        tmpl.template = tmpl._id;
        callback(null, doc, tmpl);
      });
    }

  ], function(err, doc, tmpl) {
    callback_(null, {data: doc, template: tmpl, method: "read"});
  });
}

/**
 *
 *
 */
exports.update = function(doc_, callback_){

  var status = doc_.status
    , mode = doc_.mode
    , tmplid = doc_._id;

  sync.parallel({

    // Publish时，更新文书内容
    document: function(callback){

      if (mode === "document" && doc_.value) {

        log.debug("update document");
        doc.update(doc_.value._id, doc_.value, function() {
          callback(null, "ok");
        });
      } else {
        callback(null, "none");
      }
    },
    // 更新文书定义
    template: function(callback){

      if (mode === "template") {

        log.debug("update template");
        tmpl.update(tmplid, doc_, function() {
          callback(null, "ok");
        });
      } else {
        callback(null, "none");
      }
    }
  },
  function(err, results) {
    log.debug("update success");
    callback_(null, {result: "ok", method: "update"});
  });

}

/**
 * 创建文书
 *
 */
exports.create = function(doc_, callback_){
  var mode = doc_.mode
    , tmplid = doc_.template;

  if ("document" === mode) {
    doc.create(doc_, tmplid, function() {
      callback_(null, {result: "ok", method: "create"});
    });
  }

  if ("template" === mode) {
    tmpl.create(doc_, function(templId) {
      callback_(null, {result: "ok", method: "create"});
    });
  }
}

exports.delete = function(param_, callback_){
}

/**
 * 获取文件一览
 */
exports.list = function() {

  sync.waterfall([

    // 从GridFS获取文件
    function(callback) {

      doc.at(docid_, function(doc) {
        callback_(null, doc);
      });
    }

  ], function(err, doc, tmpl) {
    callback_(null, {data: doc, template: tmpl, method: "read"});
  });
}

