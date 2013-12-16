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
          tmpExtendData.type = "KeyObject";
          tmpExtendData.object = tmpObject;
        } else {
          tmpExtendData.type = "KeyArray";
          tmpExtendData.object = data[key];
        }
      }
    }
  });
  return extendToDisplay;
}

// 取得用户ID
function getUserData(userId) {

  smart.doget("/admin/master/get.json?uid=" + userId , function(err, result) {
    if (err) {
      smart.error(err, "js.common.search.error", false);
    } else {
      $("#inputType").val(result.masterType);
      $("#inputCode").val(result.masterCode);
      $("#inputDesc").val(result.masterDescription);
      $("#inputTrsKey").val(result.masterTrsKey);

      var itemData = mongoDataToDisplayData(result.fieldSet);

      if (itemData.length > 0) {
        // 在登录画面显示item数据.
        var tmpItemList = $("#tmpl_item_list").html();
        var itemList = $("#item_list").html("");

        _.each(itemData, function(item){
          itemList.append(_.template(tmpItemList, {
            "fieldCode": item.fieldCode
            , "fieldKey": item.fieldKey
            , "fieldValue": item.fieldValue
          }));
        });

        $("#itemTable").css("display","block");
      } else {
        $("#itemTable").css("display","none");
      }

    }
  });
}

//
function editMasterData(masterId) {
  window.location = "/admin/master/edit/" + masterId;
}

//
function deleteMasterData(masterId) {

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
  getMasterData(userId);
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
