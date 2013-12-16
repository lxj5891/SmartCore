"use strict";

// 从DB中取得的item数据,转化成在画面表示的数据结构
function mongoDataToDisplayData(fieldMongoData) {
  var filedSetToDisplay = [];

  _.each(fieldMongoData, function(fieldData) {
    var fieldCode = fieldData.fieldCode;
    if (fieldData.fieldObject) {
      for(var key in fieldData.fieldObject) {
        var tempObject = { };
        tempObject.fieldCode = fieldCode;
        if (fieldData.fieldObject.hasOwnProperty(key)) {
          tempObject.fieldKey = key;
          tempObject.fieldValue = fieldData.fieldObject[key];
        }
        filedSetToDisplay.push(tempObject);
      }
    }
  });
  return filedSetToDisplay;

}

// マスタメインデータ取得
function getMasterData(masterId) {

  smart.doget("/admin/master/get.json?masterId=" + masterId , function(err, result) {
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
function render(masterId) {
  //数据取得
  getMasterData(masterId);
}

// 注册事件
function events(masterId) {

  $("#editMainData").on("click", function(event) {
    editMasterData(masterId);
  });

  $("#deleteMainData").on("click", function(event) {
    deleteMasterData(masterId);
  });
  return false;
}

$(function () {
  // 取得URL参数
  var masterId = $("#masId").val();
  // 画面表示
  render(masterId);
  // 注册事件
  events(masterId);
});
