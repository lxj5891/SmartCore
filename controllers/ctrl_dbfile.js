
var f       = require('fs')
  , p       = require('path')
  , async   = require('async')
  , confapp = require('config').app
  , _       = require('underscore')
  , log     = require('../core/log')
  , gridfs  = require('../modules/gridfs')
  , user    = require('../controllers/ctrl_user')
  , notification = require('../controllers/ctrl_notification')
  , amqp = require('../core/amqp')
  , fileinfo    = require('../modules/mod_file.js')
  , error   = require('../core/errors');
/**
 * 返回用户上传的文件列表
 */
exports.list = function(uid_, type_, start_, limit_, callback_) {

  var start = start_ || 0
    , limit = limit_ || 20
    , condition = {
          "owner": uid_
      };

  if (type_ != "all"){
    condition["metadata.tags"] = type_;
  }

  fileinfo.list(condition, start, limit, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    
    _.each(result.items, function(file) {
      // 设定文件扩展名
      file._doc["extension"] = contenttype2extension(file.contentType, file.filename);

      // 设定GridFS的文件id
      file._doc["downloadId"] =  file.history[file.history.length - 1];
    });

    callback_(err, result);
  });
};

exports.detail = function(fid_, callback_){
  var tasks =[];
  var task_getFile = function (callback){
    fileinfo.get(fid_, function(err, file){
      // 设定文件扩展名
      file._doc["extension"] = contenttype2extension(file.contentType, file.filename);

      // 设定GridFS的文件id
      file._doc["downloadId"] =  file.history[file.history.length - 1];
      callback(err, {"file": file});
    });
  };
  tasks.push(task_getFile);

  var task_getHistory = function (filedetail, callback){
    exports.history(fid_, function(err, history){
      filedetail["history"] = history;
      callback(err, filedetail);
    });
  };
  tasks.push(task_getHistory);

  var task_getFollower = function (filedetail, callback){
    var uids = filedetail.file.follower || [];
    user.listByUids(uids, 0, 0, function(err, users){
      filedetail["follower"] = users;
      callback(err, filedetail);
    });
  };
  tasks.push(task_getFollower);

  var task_getOwner = function (filedetail, callback){
    user.getUser(filedetail.file.owner, function(err, user){
      filedetail["owner"] = user;
      callback(err, filedetail);
    });
  };
  tasks.push(task_getOwner);

  var taskdone = function(err, filedetail){
    callback_(err, filedetail);
  };

  async.waterfall(tasks, taskdone);
}

exports.history = function(fid_, callback_){
  fileinfo.history(fid_,function(err,historyIds){
    gridfs.getByIds(historyIds, function(err, result){
      async.forEach(result, function(file, callback){
        file["extension"] = contenttype2extension(file.contentType, file.filename);
        file["downloadid"] = file._id;
        user.getUser(file.metadata.author, function(err,user){
          file["user"] = user;
          callback(err);
        });
      }, function(err){
        callback_(err, result);
      });
    });
  });
};

exports.getByIds = function(fids_, callback_){
  var condition = {"_id": {"$in": fids_}};
  fileinfo.find(condition, function(err, result){
    _.each(result, function(file) {
      // 设定文件扩展名
      file._doc["extension"] = contenttype2extension(file.contentType, file.filename);

      // 设定GridFS的文件id
      file._doc["downloadId"] =  file.history[file.history.length - 1];
    });
    callback_(err, result);
  });
}

exports.search = function(keyword,uid, callback_){
  fileinfo.search(keyword,uid, function(err, result){
    _.each(result, function(file) {
      // 设定文件扩展名
      file._doc["extension"] = contenttype2extension(file.contentType, file.filename);
    });
    callback_(err, result);
  });
}

/**
 * 临时保存文件
 */
exports.gridfsSave = function(uid_, files_, callback_) {

  var result = [];

  // To save the file to GridFS
  async.forEach(files_, function(file, callback){

    var name = p.basename(file.name);
    var path = f.realpathSync(p.join(confapp.tmp, p.basename(file.path)));
    
    // Set Metadata
    var metadata = {
        "author": uid_
      , "tags": tags(file.type)
    };

    gridfs.save(name, path, metadata, file.type, function(err, doc){
      result.push(doc);
      callback(err);
    });
  }, function(err){
    callback_(err, result);
  });

};

/**
 * 保存文件
 */
exports.save = function(uid_, fid_, files_, callback_) {

  var result = [];

  
  async.forEach(files_, function(file, callback){

    var name = p.basename(file.name);
    var path = f.realpathSync(p.join(confapp.tmp, p.basename(file.path)));
    
    // Set Metadata
    var metadata = {
        "author": uid_
      , "tags": tags(file.type)
    };

    // To save the file to GridFS
    gridfs.save(name, path, metadata, file.type, function(err, doc){
      
      if (err) {
        return callback(new error.InternalServer(err));
      }
      var fileObj = {};
      fileObj["filename"] = doc.filename;
      fileObj["chunkSize"] = doc.chunkSize;
      fileObj["contentType"] = doc.contentType;
      fileObj["length"] = doc.length;
      fileObj["uploadDate"] = doc.uploadDate;
      fileObj["metadata"] = doc.metadata;

      // to save file info to DB
      if(fid_){
        //update
        fileObj["$addToSet"] = {history: doc._id};
        fileinfo.update(fid_, fileObj, function(err, fInfo){
          result.push(fInfo);
          callback(err);
          //给文书关注的人和文书拥有者发消息
          // var toIds = [].concat(fInfo.owner).concat(fInfo.follower);
          // async.forEach(toIds, function(to, cb_){
          //   var n = {};
          //   n.to = to;
          //   n.createby = uid_;
          //   n.type = 5;
          //   n.content = "更新了文书: " + fInfo.filename;
          //   n.options = {"fid": fid_};
          //   notification.create(n, function(err, r){
          //     amqp.notice({
          //         _id: n.to
          //       , msg: n.content
          //     });
          //     cb_(err);
          //   });

          // },function(err){
          //   callback(err);
          // });
        });
      } else {
        //new
        fileObj["history"] = [doc._id];
        fileObj["owner"] = uid_;
        fileinfo.save(fileObj, function(err, fInfo){
          result.push(fInfo);
          callback(err);
        });
      }
      
    });
  }, function(err){
    callback_(err, result);
  });

};

/**
 * 删除文件
 */
// exports.delete = function(fid_, callback_) {
//   gridfs.delete(fid_, function(err, result){
//     if (err) {
//       return callback_(new error.InternalServer(err));
//     }

//     callback_(err, result);
//   });
// };

exports.download = function(fileid, success) {
  
  // fileid = '50168ad24cd7700000000001';
  gridfs.load(fileid, function(err, doc, info){
    success(err, doc, info);
  });
  
};

exports.follow = function(fileid, uid, success){
  fileinfo.update(fileid, {"$addToSet": {"follower": uid}}, function(err, file){
    success(err, file);
  });
};

exports.unfollow = function(fileid, uid, success){
  fileinfo.update(fileid, {"$pull": {"follower": uid}}, function(err, file){
    success(err, file);
  });
};
exports.ipaFile = function(fileId, res, success){
    if (fileId === "undefined") {
        return success();
    }
    gridfs.load(fileId, function(err, doc, info){
        if(!info) {
            log.out("info", "Image is not found. fileid:" + fileid);
            return success(new error.NotFound("Image is not found. fileid:" + fileid));
        }

        console.log(info);

        if (info.filename) {
            success();
            res.header('Content-Length', info.length);
            res.contentType(info.filename);
            res.send(doc);
            return;
        } else {
            log.out("error","filename is null");
            //TODO：未知错误  需要验证
            res.send(0);
            return;
        }
    });
};
exports.image = function(req, res, success) {
  
  var fileid =  req.params.id;

  // TODO: 字符串的undefined？客户端需要对应
  if (fileid === "undefined") {
    return success();
  }

  gridfs.load(fileid, function(err, doc, info){
    if(!info) {
        log.out("info", "Image is not found. fileid:" + fileid);
        return success(new error.NotFound("Image is not found. fileid:" + fileid));
    }

    if (info.filename) {
      res.header('Content-Length', info.length);

      // 允许图片缓存
      res.header('Cache-Control', "public, max-age=0");
      res.header('Last-Modified', info.uploadDate);
      
      res.contentType(info.filename);
      success(err, doc, info);
    } else {
      log.out("error","filename is null");
    }
  });
  
};

exports.base64 = function(req, res, success) {
  
  var fileid = '50168ad24cd7700000000001';
  gridfs.load(fileid, function(err, doc){
    success(err, doc.toString('base64'));
  });
};


/**
 * 根据Content Types，对文件分类
 */
function tags(str) {

  if (str.match(/^image\/.*$/)) {
    return "image";
  }

  if (str.match(/^video\/.*$/)) {
    return "video";
  }

  if (str.match(/^audio\/.*$/)) {
    return "audio";
  }
  
  // application / example / message / model / multipart / text
  return "application";
}

/**
 * 将Content Types，转换成文件扩展
 * TODO: 转换方式放到数据库中
 */
function contenttype2extension(contenttype, filename) {

  var mime = {
      "application/msword": "doc"
    , "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
    , "application/vnd.ms-excel": "xls"
    , "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx"
    , "application/vnd.ms-powerpoint": "ppt"
    , "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx"
    , "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx"
    , "application/pdf": "pdf"
    , "application/rtf": "rtf"
    , "application/zip": "zip"
    , "image/bmp": "bmp"
    , "image/gif": "gif"
    , "image/jpeg": "jpeg"
    , "image/png": "png"
    , "image/tiff": "tiff"
    , "text/plain": "txt"
    , "video/msvideo": "avi"
    , "video/quicktime": "mov"
  };

  var extension = mime[contenttype];
  if (extension) {
    return extension;
  }

  extension = p.extname(filename);
  if (extension.length > 0) {
    return extension.substr(1);
  }

  return "";
}

