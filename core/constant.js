
"use strict";

/**
 * 共同常量
 */
exports.VALID = 1;
exports.INVALID = 0;

/**
 * Modules层用常量
 */
// 检索件数的默认值
exports.MOD_DEFAULT_LIMIT = 20;
// number of connections in the connection pool, set to 5 as default.
exports.MOD_DB_SERVER_OPTIONS = { poolSize: 2 };

exports.MOD_DB_OPTIONS = { w: 1 };
// write in truncate mode. Existing data will be Overwrite.
exports.MOD_GRIDSTORE_MODE_WRITE = "w";
// read only. This is the default mode.
exports.MOD_GRIDSTORE_MODE_READ = "r";
