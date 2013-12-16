"use strict";

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

// 在详细画面表示用户的扩张属性值
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

// 取得用户ID
function getUserData(userId) {

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

//
function editMasterData(userId) {
  window.location = "/admin/user/edit/" + userId;
}

//
function deleteMasterData(userId) {

//  smart.dopost("/master/add.json", body, function(err, result) {
//    if (err) {
//      smart.error(err,"js.common.add.error",false);
//    } else {
//      window.location = "/master/detail";
//    }
//  });
}

// 画面表示
function render(userId) {

  // 数据取得
  getUserData(userId);
}

// 注册事件
function events(userId) {

  $("#editExtendData").on("click", function(event) {
    editMasterData(userId);
  });

  $("#deleteExtendData").on("click", function(event) {
    deleteMasterData(userId);
  });

  return false;
}

$(function () {
  // 取得URL参数
  var userId = $("#uId").val();
  // 画面表示
  render(userId);
  // 注册事件
  events(userId);
});
