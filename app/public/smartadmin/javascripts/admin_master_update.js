"use strict";

// 分类master中的fieldSet数据
var itemData = [];

// 画面上表示的item数据,转化成DB的存储结构
function displayDataToMongoData(fieldDisplayData) {
  var filedSetToDB = [];
  _.each(fieldDisplayData, function(data) {

    var searchObject = _.where(filedSetToDB, {"fieldCode": data.fieldCode});
    var fieldObject = { };
    var tempFiledSetToDB = { };

    if (searchObject && searchObject.length > 0) {
      searchObject[0].fieldObject[data.fieldKey] = data.fieldValue;
    } else {
      fieldObject[data.fieldKey] = data.fieldValue;
      tempFiledSetToDB.fieldCode = data.fieldCode;
      tempFiledSetToDB.fieldObject = fieldObject;
      filedSetToDB.push(tempFiledSetToDB);
    }
  });
  return filedSetToDB;
}

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

// マスタメインアイテムデータ取得
function getMasterItemData(fieldData) {
  var masterItemData = itemData;

  // TODO check追加
  if (fieldData && fieldData.length > 0) {
    var searchObject = _.where(masterItemData, {"fieldCode": fieldData[0].fieldCode});
    if (searchObject && searchObject.length > 0) {
      for(var i = 0,len = masterItemData.length; i < len; i++) {
        if (masterItemData[i].fieldCode === fieldData[0].fieldCode) {
          delete masterItemData[i];
        }
      }
      masterItemData = _.compact(masterItemData);
    }
    _.each(fieldData, function(data) {
      masterItemData.push(data);
    });

    itemData = masterItemData;
  }

  return masterItemData;
}

// マスタメインデータ取得
function getMasterData() {

  // 数据转化
  var tempItemData = getMasterItemData();
  var filedSetData =  displayDataToMongoData(tempItemData);

  var masterData = {
      masterType: $("#inputType").val()
    , masterCode: $("#inputCode").val()
    , masterDescription: $("#inputDesc").val()
    , masterTrsKey: $("#inputTrsKey").val()
    , fieldSet: filedSetData
    };
  return masterData;
}

// マスタのメインデータ追加
function addMasterData(masterData) {

  var body = {
    master: masterData
  };

  smart.dopost("/admin/master/add.json", body, function(err, result) {
    if (err) {
      smart.error(err, "js.common.add.error", false);
    } else {
      window.location = "/admin/master/detail/" + result.data._id;
    }
  });
}

// マスタのメインデータ更新
function updateMasterData(masterData, masterId) {

  var body = {
      masterId: masterId
    , updateMaster: masterData
    };

  smart.doput("/admin/master/update.json", body, function(err, result) {
    if (err) {
      smart.error(err, "js.common.add.error", false);
    } else {
      window.location = "/admin/master/detail/" + result.data._id;
    }
  });
}

function displayMasterData(masterId) {
  smart.doget("/admin/master/get.json?masterId=" + masterId , function(err, result) {
    if (err) {
      smart.error(err, "js.common.search.error", false);
    } else {
      $("#inputType").val(result.masterType);
      $("#inputCode").val(result.masterCode);
      $("#inputDesc").val(result.masterDescription);
      $("#inputTrsKey").val(result.masterTrsKey);

      itemData = mongoDataToDisplayData(result.fieldSet);

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

// 画面表示
function render(masterId) {
  if (masterId && masterId.length > 0) {
    displayMasterData(masterId);
  } else {
    $("#itemTable").css("display","none");
  }

}

// 注册事件
function events(masterId) {

  // 打开item的pop画面
  $("#item_list").on("click", "tr", function(event) {

    var fieldCode = $(event.target).parent().attr("fieldcode");
    $("#fieldCode").val(fieldCode);

    var fileSetData = _.where(itemData, { fieldCode: fieldCode });

    var tmpItem = $("#tmpl_item_object").html();
    var itemObject = $("#item_object").html("");

    _.each(fileSetData, function(item){
      itemObject.append(_.template(tmpItem, {
          "fieldKey": item.fieldKey
        , "fieldValue": item.fieldValue
        }));
    });
    $("#myModal").modal("show");
  });

  // 在item的pop画面上追加item数据
  $("#itemobject").bind("click", function(event) {
    var tmpItem = $("#tmpl_item_object").html();
    $("#item_object").append(_.template(tmpItem, {
        "fieldKey": ""
      , "fieldValue": ""
      }));
  });

  // 在item的pop画面上,删除item的key-value
  $("#item_object").on("click", "a", function(event) {

    // TODO 点击周围区域时,有bug.
    $(event.target).parent().parent().parent().remove();
  });

  // 在item的pop画面上的保存按钮,pop画面的数据显示在master登录画面.
  $("#saveItemObject").on("click", function(event) {

    var fieldCode = $("#fieldCode").val();

    // pop画面上的入力数据临时保存
    var fieldSet = [];
    $("[name=\"fields\"]").each(function () {
      var fieldData = {
          "fieldCode": fieldCode
        , "fieldKey": $(this).find("[name=\"fieldKey\"]").val()
        , "fieldValue": $(this).find("[name=\"fieldValue\"]").val()
        };
      fieldSet.push(fieldData);
    });

    var itemData = getMasterItemData(fieldSet);

    // 在登录画面显示item数据.
    var tmpItemList = $("#tmpl_item_list").html();
    var itemList = $("#item_list").html("");

    if (itemData.length > 0) {
      $("#itemTable").css("display","block");
    }

    _.each(itemData, function(item){
      itemList.append(_.template(tmpItemList, {
          "fieldCode": item.fieldCode
        , "fieldKey": item.fieldKey
        , "fieldValue": item.fieldValue
        }));
    });

    // 清除pop画面的数据,关闭pop画面.
    $("#fieldCode").val("");
    $("#item_object").children().remove();
    $("#myModal").modal("hide");

  });

  // master数据登录
  $("#addMainData").bind("click", function(event) {

    var masterMainData = getMasterData();

    // 清除画面上的item数据.
    itemData = [];

    if (masterId && masterId.length > 0) {
      updateMasterData(masterMainData, masterId);
    } else {
      addMasterData(masterMainData);
    }

    return false;
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
