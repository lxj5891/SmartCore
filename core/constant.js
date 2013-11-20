/**
 * @file 常量定义类
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

/**
 * 共同常量
 */
exports.VALID = 1;
exports.INVALID = 0;

/** 缺省的多国语言分类 */
exports.DEFAULT_I18N_LANG = "en";
exports.DEFAULT_I18N_CATEGORY = "smart";

/**
 * Modules层用常量
 */
// the number of documents to skip
exports.MOD_DEFAULT_START = 0;
// 检索件数的默认值
exports.MOD_DEFAULT_LIMIT = 20;
// number of connections in the connection pool, set to 5 as default.
exports.MOD_DB_SERVER_OPTIONS = { poolSize: 2 };

exports.MOD_DB_OPTIONS = { w: 1 };
// write in truncate mode. Existing data will be Overwrite.
exports.MOD_GRIDSTORE_MODE_WRITE = "w";
// read only. This is the default mode.
exports.MOD_GRIDSTORE_MODE_READ = "r";


/** 组类型 */
exports.GROUP_TYPE_DEPARTMENT = "1"; // 部门（公司组织结构）
exports.GROUP_TYPE_GROUP = "2"; // 组（自由创建）
exports.GROUP_TYPE_OFFICIAL = "3"; // 职位组

/** 组公开性 */
exports.GROUP_PRIVATE = "1"; // 私密
exports.GROUP_PUBLIC = "2"; // 公开

exports.ACLINK_TYPE_USER_PERMISSION = "1";

exports.MODULES_NAME_ACLINK = "ACLink";
exports.MODULES_NAME_FILE = "File";
exports.MODULES_NAME_GROUP = "Group";
exports.MODULES_NAME_MASTER = "Master";
exports.MODULES_NAME_USER = "User";
exports.MODULES_NAME_I18N = "I18n";
exports.MODULES_NAME_COMPANY = "Company";



