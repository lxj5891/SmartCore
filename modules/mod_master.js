/**
 * @file 分类的module
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed
  , constant    = require("../core/constant")
  , conn        = require("../core/connection");

/**
 * 分类的model
 */

var  Master = new schema({
    masterCode         : { type: String,   description: "分类Code:pro,sex," }
  , masterDescription  : { type: String,   description: "分类描述" }
  , masterTrsKey       : { type: String,   description: "翻译Key" }
  , masterType         : { type: String,   description: "类型:员工,产品,顾客等" }
  , fieldSet           : [ {
      fieldCode        : { type: String,   description: "属性Key" }
    , fieldObject      : { type: Mixed,    description: "属性对象" }
    }
  ]
  , valid              : { type: Number,   description: "删除 0:无效 1:有效", default: constant.VALID }
  , createAt           : { type: Date,     description: "创建时间" }
  , createBy           : { type: String,   description: "创建者" }
  , updateAt           : { type: Date,     description: "更新时间" }
  , updateBy           : { type: String,   description: "更新者" }
  });

/**
 * 使用定义好的Schema,通过公司Code生成分类的model
 * @param {String} code 公司code
 * @returns {model} File model
 */
function model(code) {
  return conn.model(code, constant.MODULES_NAME_MASTER, Master);
}