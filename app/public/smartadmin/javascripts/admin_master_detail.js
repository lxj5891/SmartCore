"use strict";

// マスタメインデータ取得
function getMasterMainData(masterId) {

  smart.doget("/master/get.json?masterId=" + masterId , function(err, result) {
    if (err) {
      smart.error(err, "js.common.search.error", false);
    } else {
      $("#inputType").val(result.masterType);
      $("#inputCode").val(result.masterCode);
      $("#inputDesc").val(result.masterDescription);
    }
  });
}

// マスタアイテムデータ取得
function getMasterItemsData() {

}

// マスタのメインデータ追加
function addMasterMainData(masterMainData) {

  var body = {
    master: masterMainData
  };

  smart.dopost("/master/add.json", body, function(err, result) {
    if (err) {
      smart.error(err,"js.common.add.error",false);
    } else {
      window.location = "/master/detail";
    }

  });
}

// マスタのアイテムデータ追加
function addMasterItemsData() {

}

// マスタのメインデータ更新
function updateMasterMainData() {

}

// マスタのアイテムデータ更新
function updateMasterItemsData() {

}

// マスタのメインデータ削除
function deleteMasterMainData() {

}

// マスタのアイテムデータ削除
function deleteMasterItemsData() {

}

// 画面表示
function render(masterId) {
  //数据取得
  getMasterMainData(masterId);
}

// 注册事件
function events() {

  // 追加item
  $("#itemobject").bind("click", function(event) {
    var tmpItem = $("#tmpl_item_object").html();

    $("#item_object").append(_.template(tmpItem));

  });

  //
  $("#item_list").on("click", "tr", function(event) {

    $("#myModal").modal("show");
  });

  // 删除item的key-value
  $("#item_object").on("click", "a", function(event) {

    $(event.target).parent().parent().parent().remove();

  });

  // item追加画面的值,显示在master登录画面.
  $("#saveItemObject").on("click", function(event) {

    var fieldCode = $("#fieldCode").val();
    var tmpItemList = $("#tmpl_item_list").html();

    $("[name='fields\']").each(function () {
      $("#item_list").append(_.template(tmpItemList, {
          "fieldCode": fieldCode
        , "fieldKey": $(this).find("[name=\"fieldKey\"]").val()
        , "fieldValue": $(this).find("[name=\"fieldValue\"]").val()
        }));
    });
    // 保存到master登录画面后,清除.
    $("#fieldCode").val("");
    $("#item_object").children().remove();

    $("#myModal").modal("hide");
  });

  return false;
}

$(function () {
  // 取得URL参数
  var masterId = $("#masId").val();
  // 画面表示
  render(masterId);
  // 注册时间
  events();
});
