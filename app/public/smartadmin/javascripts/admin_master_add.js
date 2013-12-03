"use strict";

// マスタメインデータ取得
function getMasterMainData() {
  var masterMainData = {
      masterType: $("#inputType").val()
    , masterCode: $("#inputCode").val()
    , masterDescription: $("#inputDesc").val()
    };
  return masterMainData;
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
      window.location = "/master/detail/" + result.data._id;
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
function render() {

}

// 注册事件
function events() {

  $("#addMainData").bind("click", function(event){
    //
    var masterMainData = getMasterMainData();

    //
    addMasterMainData(masterMainData);
    return false;
  });
}

$(function () {
  // 取得URL参数
//  var masterid = $("#masterid").val();
  // 画面表示
  render();
  // 注册时间
  events();
});
