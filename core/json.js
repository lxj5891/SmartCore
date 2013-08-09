
/**
 * 发送JSON数据
 */
exports.send = function(res, error, data) {

  // 设定ContentType
  res.contentType('application/json; charset=UTF-8');

  // 返回错误信息
  if (error) {
    return res.send(error.code, exports.errorSchema(error.code, error.message));
  }

  // 返回JSON数据
  return res.send(exports.dataSchema(data));
}
/**
 * 发送自定义错误JSON数据
 */
exports.sendError = function(res, error) {
    // 设定ContentType
    res.contentType('application/json; charset=UTF-8');

    // 返回错误信息
    return res.send(exports.errorSchema(error.code, error.message));
}

exports.dataSchema = function(data) {
  return {
    apiVersion: "1.0",
    data: data,
  };
}

exports.errorSchema = function(code, message, errors) {
  return {
    "apiVersion": "1.0",
    "error": {
      "code": code,
      "message": message,
      "errors": errors
    }
  };
}

exports.fullSchema = function() {
  return {
    apiVersion: "1.0",
    context: "string",
    id: "string",
    method: "string",
    params: {
      id: "string"
    },

    // 响应的数据
    data: {
      kind: "string",
      fields: "string",
      etag: "string",
      id: "string",
      lang: "string",
      updated: "string",
      deleted: "boolean",

      // 分页信息
      currentItemCount: "integer",
      itemsPerPage: "integer",
      startIndex: "integer",
      totalItems: "integer",
      pageIndex: "integer",
      totalPages: "integer",
      pageLinkTemplate: "string",

      // 链接
      next: {},
      nextLink: "string",
      previous: {},
      previousLink: "string",
      self: {},
      selfLink: "string",
      edit: {},
      editLink: "string",

      // 表示一组数据
      items: [
        {
          vals: {}
        }
      ]
    },

    // 提供错误的详细信息
    error: {
      code: "integer",
      message: "string",
      errors: [
        {
          domain: "string",
          reason: "string",
          message: "string",
          location: "string",
          locationType: "string",
          extendedHelp: "string",
          sendReport: "string"
        }
      ]
    }
  };
}
