"use strict";

// 追加单元格可编辑属性
function editableCol(oTable) {
  var csrf = $("#_csrf").val();
  oTable.$("td").editable("/admin/i18n/update.json?_csrf="+ csrf, {
    "callback": function( sValue, y ) {
      var aPos = oTable.fnGetPosition( this );
      oTable.fnUpdate( sValue, aPos[0], aPos[1] );
    },
    "submitdata": function ( value, settings ) {
      // oTable.fnGetPosition( this )
      // [row index, column index (visible), column index (all)]
      return {
        "id": oTable.fnGetPosition( this )[1],
        "key": oTable.fnGetData(oTable.fnGetPosition( this )[0]).key,
        "col": _.keys(oTable.fnGetData(oTable.fnGetPosition( this )[0]))[oTable.fnGetPosition( this )[1]]
      };
    }
  } );
}

function render() {

  smart.doget("/admin/i18n/list.json", function(err, result) {

    if (err) {
      smart.error(err,"js.common.search.error", false);
    } else {

      var oTable = $("#table_id").dataTable( {
        "aaData": result,
        "aoColumns": [
          { "sTitle": "分类","mData": "category","sClass": "left","sName":"category"},
          { "sTitle": "词条key", "mData": "key" ,"sClass": "left"},
          { "sTitle": "zh", "mData": "zh" ,"sClass": "left"},
          { "sTitle": "ja", "mData": "ja" ,"sClass": "left"},
          { "sTitle": "en", "mData": "en" ,"sClass": "left"}
        ]
      });

      editableCol(oTable);
    }
  });
}

function events() {

  // i18n追加数据
  $("#addI18nRow").bind("click", function(event) {

    var oTable = $("#table_id").dataTable();

    //TODO 动态
    oTable.fnAddData([{"category":"","key":"","zh":"","ja":"","en":""}]);

    editableCol(oTable);

    return false;
  });

  // i18n追加语言
  $("#addI18nCol").bind("click", function(event) {

    var th = window.prompt("タイトルを入力してください。");

    $("#table_id thead tr").append("<th class=\"sorting_disabled left\" tabindex=\"0\" rowspan=\"1\""+
                                   "colspan=\"1\" style=\"width: 354px;\">" + th+ "</th>");

    var rows = $("#table_id tbody tr");
    for (var i = 0; i < rows.length; i++) {
      $(rows[i]).append("<td class=\"left\"></td>");
    }

    var oTable = $("#table_id").dataTable();

    editableCol(oTable);

    return false;
  });
}


$(function () {

  // 画面表示
  render();

  // 注册事件
  events();
});