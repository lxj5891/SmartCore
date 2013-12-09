"use strict";

// 分类master中的fieldSet数据
var itemData = [];

// 画面上表示的item数据,转化成DB的存储结构
function dispalyDataToMongoData(fieldDisplayData) {
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

// マスタメインアイテムデータ取得
function getMasterItemData(fieldData) {
  var masterItemData = itemData;

  // TODO check追加
  if (fieldData && fieldData.length > 0) {
    _.each(fieldData, function(data) {
      masterItemData.push(data);
    });
  }

  return masterItemData;
}

// マスタメインデータ取得
function getMasterData() {

  // 数据转化
  var tempItemData = getMasterItemData();
  var filedSetData =  dispalyDataToMongoData(tempItemData);

  var masterData = {
      masterType: $("#inputType").val()
    , masterCode: $("#inputCode").val()
    , masterDescription: $("#inputDesc").val()
    , fieldSet: filedSetData
    };
  return masterData;
}

// マスタのメインデータ追加
function addMasterData(masterData) {

  var body = {
    master: masterData
  };

  smart.dopost("/master/add.json", body, function(err, result) {
    if (err) {
      smart.error(err,"js.common.add.error",false);
    } else {
      window.location = "/master/detail/" + result.data._id;
    }
  });
}

// 画面表示
function render() {
  $("#itemTable").css("display","none");
}

// 注册事件
function events() {

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

    addMasterData(masterMainData);

    return false;
  });

  return false;
}

$(function () {
  // 画面表示
  render();
  // 注册事件
  events();
});
