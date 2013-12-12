"use strict";

// 分类user中的fieldSet数据
var userData = [];

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

// 取得入力画面的用户数据
function getUserData() {

  // 数据转化
//  var tempItemData = getuserItemData();
//  var filedSetData =  dispalyDataToMongoData(tempItemData);

  var userData = {
      userName: $("#inputUserName").val()
    , first: $("#inputFirst").val()
    , middle: $("#inputMiddle").val()
    , last: $("#inputLast").val()
    , password: $("#inputPassword").val()
//    , groups: $("#inputGroups").val()
    , email: $("#inputEmail").val()
    , lang: $("#inputLang").val()
    , timezone: $("#inputTimezone").val()
    , status: $("#inputStatus").val()
//    , extend: filedSetData
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

  var body = {
      userId: userId
    , updateUser: userData
    };

  smart.doput("/admin/user/update.json", body, function(err, result) {
    if (err) {
      smart.error(err, "js.common.add.error", false);
    } else {
      window.location = "/admin/user/detail/" + result.data._id;
    }
  });
}

function displayUserData(userId) {
  smart.doget("/admin/user/get.json?userId=" + userId , function(err, result) {
    if (err) {
      smart.error(err, "js.common.search.error", false);
    } else {
      $("#inputType").val(result.userType);
      $("#inputCode").val(result.userCode);
      $("#inputDesc").val(result.userDescription);
      $("#inputTrsKey").val(result.userTrsKey);

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
function render(userId) {
  if (userId && userId.length > 0) {
    displayUserData(userId);
  } else {
    $("#itemTable").css("display","none");
  }

}

// 注册事件
function events(userId) {

//  // 打开item的pop画面
//  $("#item_list").on("click", "tr", function(event) {
//
//    var fieldCode = $(event.target).parent().attr("fieldcode");
//    $("#fieldCode").val(fieldCode);
//
//    var fileSetData = _.where(itemData, { fieldCode: fieldCode });
//
//    var tmpItem = $("#tmpl_item_object").html();
//    var itemObject = $("#item_object").html("");
//
//    _.each(fileSetData, function(item){
//      itemObject.append(_.template(tmpItem, {
//        "fieldKey": item.fieldKey
//        , "fieldValue": item.fieldValue
//      }));
//    });
//    $("#myModal").modal("show");
//  });
//
//  // 在item的pop画面上追加item数据
//  $("#itemobject").bind("click", function(event) {
//    var tmpItem = $("#tmpl_item_object").html();
//    $("#item_object").append(_.template(tmpItem, {
//      "fieldKey": ""
//      , "fieldValue": ""
//    }));
//  });
//
//  // 在item的pop画面上,删除item的key-value
//  $("#item_object").on("click", "a", function(event) {
//
//    // TODO 点击周围区域时,有bug.
//    $(event.target).parent().parent().parent().remove();
//  });
//
//  // 在item的pop画面上的保存按钮,pop画面的数据显示在user登录画面.
//  $("#saveItemObject").on("click", function(event) {
//
//    var fieldCode = $("#fieldCode").val();
//
//    // pop画面上的入力数据临时保存
//    var fieldSet = [];
//    $("[name=\"fields\"]").each(function () {
//      var fieldData = {
//        "fieldCode": fieldCode
//        , "fieldKey": $(this).find("[name=\"fieldKey\"]").val()
//        , "fieldValue": $(this).find("[name=\"fieldValue\"]").val()
//      };
//      fieldSet.push(fieldData);
//    });
//
//    var itemData = getuserItemData(fieldSet);
//
//    // 在登录画面显示item数据.
//    var tmpItemList = $("#tmpl_item_list").html();
//    var itemList = $("#item_list").html("");
//
//    if (itemData.length > 0) {
//      $("#itemTable").css("display","block");
//    }
//
//    _.each(itemData, function(item){
//      itemList.append(_.template(tmpItemList, {
//        "fieldCode": item.fieldCode
//        , "fieldKey": item.fieldKey
//        , "fieldValue": item.fieldValue
//      }));
//    });
//
//    // 清除pop画面的数据,关闭pop画面.
//    $("#fieldCode").val("");
//    $("#item_object").children().remove();
//    $("#myModal").modal("hide");
//
//  });

  // user数据登录
  $("#addMainData").bind("click", function(event) {

    var userData = getUserData();

    // 清除画面上的item数据.
//    itemData = [];

    if (userId && userId.length > 0) {
      // updateUserData(userData, userId);
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
