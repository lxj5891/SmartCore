"use strict";


// TODO bug list
// TODO 1.画面变形 2.在画面输入重复key时，没有删除行的操作
// 追加单元格可编辑属性，单元格数值修改时出发更新操作。
function editableCol(oTable, col) {
  var csrf = $("#_csrf").val();
  oTable.$("td").editable("/admin/i18n/update.json?_csrf="+ csrf, {
    "callback": function( sValue, y ) {
      var aPos = oTable.fnGetPosition( this );
      //TODO bug 错误处理没有弹出画面
      var value = JSON.parse(sValue).data;
      oTable.fnUpdate( value, aPos[0], aPos[1] );
    },
    "submitdata": function ( value, settings ) {
      // oTable.fnGetPosition( this )的返回值：row的index，col的index
      // [row index, column index (visible), column index (all)]
      var lang =_.keys(oTable.fnGetData(oTable.fnGetPosition( this )[0]))[oTable.fnGetPosition( this )[1]] || col;
      return {
        "id": oTable.fnGetPosition( this )[1],
        "key": oTable.fnGetData(oTable.fnGetPosition( this )[0]).key,
        "lang": lang
      };
    }
  } );
}

function render() {

  smart.doget("/admin/i18n/list.json", function(err, result) {

    if (err) {
      smart.error(err,"js.common.search.error", false);
    } else {

      var columnsArray = [];

      // 有词条时，动态生成列.每条词条的语种数不同，生成语种数最多的列
      // TODO bug 词条的语种数不等的时候，一览画面表示时，有dataTables的提示。
      if (result.length > 0) {
        _.each(result, function(data) {
          _.each(data, function(val, key) {
            var where = _.where(columnsArray, {"mData": key});
            if ( where.length === 0) {
              columnsArray.push({ "sTitle": key, "mData": key ,"sClass": "left" });
            }
          });
        });
      // 没有词条时，默认列
      } else {
        columnsArray.push({ "sTitle": "category","mData": "category","sClass": "left" });
        columnsArray.push({ "sTitle": "key", "mData": "key" ,"sClass": "left" });
        columnsArray.push({ "sTitle": "zh", "mData": "zh" ,"sClass": "left" });
        columnsArray.push({ "sTitle": "ja", "mData": "ja" ,"sClass": "left" });
        columnsArray.push({ "sTitle": "en", "mData": "en" ,"sClass": "left" });
      }

      var oTable = $("#table_id").dataTable( {
//        "bSort": false,
        "sSortAsc": "header headerSortDown",
        "sSortDesc": "header headerSortUp",
        "sSortable": "header",
        "sPaginationType": "full_numbers",
        "sEcho": 3,
        "iTotalRecords": result.length,
        "iTotalDisplayRecords": result.length,
        "aaData": result,
        "aoColumns": columnsArray
      });

      editableCol(oTable);
    }
  });
}

function events() {

  // i18n追加词条
  $("#addI18nRow").bind("click", function(event) {

    var oTable = $("#table_id").dataTable();

    // 生成row的对象，列不固定。
    var row = {};
    _.each(oTable.fnSettings().aoColumns, function(data) {
      row[data.mData] = "";
    });

    oTable.fnAddData([row]);

    editableCol(oTable);

    return false;
  });

  // i18n追加语种
  $("#addI18nCol").bind("click", function(event) {

    var th = window.prompt("タイトルを入力してください。");

    $("#table_id thead tr").append("<th class=\"sorting_disabled left\" tabindex=\"0\" rowspan=\"1\""+
                                   "colspan=\"1\" style=\"width: 354px;\">" + th+ "</th>");

    var rows = $("#table_id tbody tr");
    for (var i = 0; i < rows.length; i++) {
      $(rows[i]).append("<td class=\"left\"></td>");
    }

    var oTable = $("#table_id").dataTable();

    editableCol(oTable, th);

    return false;
  });
}


$(function () {

  // 画面表示
  render();

  // 注册事件
  events();
});