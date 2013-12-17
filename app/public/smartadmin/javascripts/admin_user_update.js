"use strict";

// 保存用户的扩张属性数据{数据类型:"",数据:""}
// 数据类型:KeyValue,KeyObject,KeyArray
// 对应数据:Object
var extendData = [];

// 画面上表示的扩张属性,转化成DB的存储结构
function displayDataToMongoData() {
  var extendToDB = {};
  _.each(extendData, function(data) {
    for (var key in data.object) {
      if (data.object.hasOwnProperty(key)) {

        if ("KeyValue" === data.type) {
          extendToDB[key] = data.object[key];
        } else if ("KeyObject" === data.type) {
          var tempObject = {};
          for (var i=0,len=data.object[key].length; i < len; i++) {
            tempObject[data.object[key][i].key] = data.object[key][i].value;
          }
          extendToDB[key] = tempObject;
        } else {
          extendToDB[key] = data.object[key];
        }
      }
    }
  });
  return extendToDB;
}

// 从DB中取得的扩张属性数据,转化成在画面表示的数据结构
function mongoDataToDisplayData(dbExtendData) {
  var extendToDisplay = [];

  _.each(dbExtendData, function(data) {
    var tmpExtendData = {};

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === "string") {
          var tmpData = {};
          tmpData[key] = data[key];
          tmpExtendData.type = "KeyValue";
          tmpExtendData.object = tmpData;
        } else if (typeof data[key] === "object") {
          var tmpObjectAll = {};
          var tmpObject = [];
          for (var keyO in data[key]) {
            if (data[key].hasOwnProperty(keyO)) {
              var tmpDataObject = {
                  "key": keyO
                , "value": data[key][keyO]
                };
              tmpObject.push(tmpDataObject);
            }
          }
          tmpObjectAll[key] = tmpObject;
          tmpExtendData.type = "KeyObject";
          tmpExtendData.object = tmpObjectAll;
        } else {
          tmpExtendData.type = "KeyArray";
          tmpExtendData.object = data[key];
        }
      }
    }
    extendToDisplay.push(tmpExtendData);
  });
  return extendToDisplay;
}

// 取得入力的扩张属性值
function getPopExtendData() {
  var rtnExtData = {};
  var rtnExtType;

  // Key:Value的场合
  if ("block" === $("#keyValuePop").css("display")) {
    var tempKey = $("#keyValue_Key").val();
    var tempValue = $("#keyValue_Value").val();
    rtnExtData[tempKey] = tempValue;
    rtnExtType = "KeyValue";

  // Key:Object的场合
  } else if ("block" === $("#keyObjectPop").css("display")) {

    // pop画面上的入力数据临时保存
    var extendObject = [];
    var tempObjectKey = $("#keyObject_Key").val();
    $("[name=\"object\"]").each(function () {
      var objectData = {
          "key": $(this).find("[name=\"objectKey\"]").val()
        , "value": $(this).find("[name=\"objectValue\"]").val()
        };
      extendObject.push(objectData);
    });

    rtnExtData[tempObjectKey] = extendObject;
    rtnExtType = "KeyObject";

  // Key:Array的场合
  } else {

    // pop画面上的入力数据临时保存
    var extendArray = [];
    var tempArrayKey = $("#keyArray_Key").val();

    $("[name=\"array\"]").each(function () {
      var  value = $(this).find("[name=\"arrayValue\"]").val();
      extendArray.push(value);
    });

    rtnExtData[tempArrayKey] = extendArray;
    rtnExtType = "KeyArray";
  }

  return {type:rtnExtType, object:rtnExtData};
}

// 数据检证,和已经入力的数据整合
function checkExtendData(extData) {

  var tmpExtendData = extendData;

  // 如果扩张属性key重复时,删除
  if (extData.object) {
    for (var key in extData.object) {
      for (var i = 0,len = extendData.length; i < len; i++) {
        if (extData.object.hasOwnProperty(key) && extendData[i].object.hasOwnProperty(key)) {
          delete tmpExtendData[i];
        }
      }
    }
  }
  // 清除数组删除后的不连续断点.
  tmpExtendData = _.compact(tmpExtendData);

  // 追加新的扩张属性
  tmpExtendData.push(extData);

  extendData = tmpExtendData;
  return extendData;
}

// 在追加画面表示入力的扩张属性值
function displayExtendData(extendData) {
  var tmpItem = $("#tmpl_item_extend").html();
  $("#item_extend").html("");

  _.each(extendData, function(extData) {
    if (extData.object) {
      for (var key in extData.object) {
        if (extData.object.hasOwnProperty(key)) {

          // Key:Value的场合
          if ("KeyValue" === extData.type) {
            $("#item_extend").append(_.template(tmpItem, {
                "extendType": "value"
              , "extendKey": key
              , "extendValue":  extData.object[key]
              }));

            // Key:Object的场合
          } else if ("KeyObject" === extData.type) {
            $("#item_extend").append(_.template(tmpItem, {
                "extendType": "object"
              , "extendKey": key
              , "extendObject":  extData.object[key]
              }));

            // Key:Array的场合
          } else {
            $("#item_extend").append(_.template(tmpItem, {
                "extendType": "array"
              , "extendKey": key
              , "extendArray":  extData.object[key]
              }));
          }
        }
      }
    }
  });

}

// 取得入力画面的用户数据
function getUserData() {

  var extendData =  displayDataToMongoData();

  // TODO lang timezone
  var userData = {
      userName: $("#inputUserName").val()
    , first: $("#inputFirst").val()
    , middle: $("#inputMiddle").val()
    , last: $("#inputLast").val()
    , password: $("#inputPassword").val()
//    , groups: $("#inputGroups").val() //TODO group []
    , email: $("#inputEmail").val()
//    , lang: $("#inputLang").val()
//    , timezone: $("#inputTimezone").val()
//    , status: $("#inputStatus").val()
    , lang: "ja"
    , timezone: "GMT+08:00"
    , status: $("#inputStatus").val()
    , extend: extendData
    };
  return userData;
}

// 追加用户
function addUserData(userData) {

  smart.dopost("/admin/user/add.json", userData, function(err, result) {
    if (err) {
      smart.error(err, "js.common.add.error", false);
    } else {
      window.location = "/admin/user/detail/" + result.data._id;
    }
  });
}

// 更新用户
function updateUserData(userData, userId) {

  userData.uid = userId;

  smart.doput("/admin/user/update.json", userData, function(err, result) {
    if (err) {
      smart.error(err, "js.common.add.error", false);
    } else {
      window.location = "/admin/user/detail/" + result._id;
    }
  });
}

// 编辑时的画面表示
function displayUserData(userId) {
  smart.doget("/admin/user/get.json?uid=" + userId , function(err, result) {
    if (err) {
      smart.error(err, "js.common.search.error", false);
    } else {
      $("#inputUserName").val(result.userName);
      $("#inputFirst").val(result.first);
      $("#inputMiddle").val(result.middle);
      $("#inputLast").val(result.last);
      $("#inputPassword").val(result.password);
      $("#inputGroups").val(result.groups);
      $("#inputEmail").val(result.email);
      $("#inputLang").val(result.lang);
      $("#inputTimezone").val(result.timezone);
      $("#inputStatus").val(result.status);

      var dbData = [];
      dbData.push(result.extend);
      var extendData = mongoDataToDisplayData(dbData);

      if (extendData.length > 0) {

        displayExtendData(extendData);

        $("#itemTable").css("display","block");
      } else {
        $("#itemTable").css("display","none");
      }
    }
  });
}

// 画面表示
function render(userId) {
  if (userId && userId.length > 0) {
    displayUserData(userId);
  } else {
    $("#extendTable").css("display","none");
  }
}

// 注册事件
function events(userId) {

  // 扩展属性类型选择的pop画面
  $("#nextSelect").on("click", function(event) {

    var selectedType = $("input[name=\"optionsRadios\"]:checked").val();

    if ("Key:Value" === selectedType) {
      $("#keyValuePop").css("display","block");
      $("#keyObjectPop").css("display","none");
      $("#keyValueArryPop").css("display","none");
    } else if ("Key:Object" === selectedType) {
      $("#keyValuePop").css("display","none");
      $("#keyObjectPop").css("display","block");
      $("#keyValueArryPop").css("display","none");
    } else if ("Key:Array[]" === selectedType) {
      $("#keyValuePop").css("display","none");
      $("#keyObjectPop").css("display","none");
      $("#keyValueArryPop").css("display","block");
    } else {
      $("#keyValuePop").css("display","none");
      $("#keyObjectPop").css("display","none");
      $("#keyValueArryPop").css("display","none");
    }

    $("#extendType").modal("hide");
  });

  // 追加[Key:Object]的属性对象
  $("#keyObject_Object").bind("click", function(event) {
    var tmpItem = $("#tmpl_item_object").html();
    $("#item_object").append(_.template(tmpItem, {
        "objectKey": ""
      , "objectValue": ""
      }));
  });

  // 追加[Key:Array]的属性对象
  $("#keyArray_Value").bind("click", function(event) {
    var tmpItem = $("#tmpl_item_array").html();
    $("#item_array").append(_.template(tmpItem, {
      "arrayValue": ""
    }));
  });

  // 删除[Key:Object]的属性[key-value]
  $("#item_object").on("click", "a", function(event) {

    // TODO 点击周围区域时,有bug.
    $(event.target).parent().parent().parent().remove();
  });

  // 删除[Key:Array]的属性[value]
  $("#item_array").on("click", "a", function(event) {

    // TODO 点击周围区域时,有bug.
    $(event.target).parent().parent().parent().remove();
  });

  // 保存入力的扩张属性值
  $("#saveExtend").on("click", function(event) {

    // 取得pop画面上入力的扩展属性值
    var popData = getPopExtendData();

    // 数据检证,和已经入力的数据整合.
    var tmpExtendData = checkExtendData(popData);
    // pop上入力值在父画面显示
    displayExtendData(tmpExtendData);
    $("#extendTable").css("display","block");

    // 清除pop画面的数据,关闭pop画面.
    // Key-Value
    $("#keyValue_Key").val("");
    $("#keyValue_Value").val("");
    // Key-Object
    $("#keyObject_Key").val("");
    $("#item_object").children().remove();
    // Key-Array
    $("#keyArray_Key").val("");
    $("#item_array").children().remove();

    $("#myModal").modal("hide");
  });

  // user数据登录
  $("#addMainData").bind("click", function(event) {

    var userData = getUserData();

    // 清除画面上的ext数据.
    extendData = [];

    if (userId && userId.length > 0) {
      updateUserData(userData, userId);
    } else {
      addUserData(userData);
    }
    return false;
  });
  return false;
}

$(function () {
  // 取得URL参数
  var uId = $("#uId").val();
  // 画面表示
  render(uId);
  // 注册事件
  events(uId);
});
