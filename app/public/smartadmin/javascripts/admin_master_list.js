"use strict";

function render() {

  smart.doget("/admin/master/list.json", function(err, result) {

    if (err) {
      smart.error(err,"js.common.search.error", false);
    } else {
      var index = 1;
      // TODO bug index 不正确
      $("#table_id").dataTable( {
        "bSort": false,
        "sSortAsc": "header headerSortDown",
        "sSortDesc": "header headerSortUp",
        "sSortable": "header",
        "sPaginationType": "full_numbers",
        "sEcho": 3,
        "iTotalRecords": result.length,
        "iTotalDisplayRecords": result.length,
        "aaData": result,
        "aoColumns": [
          { "sTitle": "#","mData": "_id","sClass": "left"},
          { "sTitle": "タイプ", "mData": "masterType" ,"sClass": "left"},
          { "sTitle": "コード", "mData": "masterCode" ,"sClass": "left"},
          { "sTitle": "説明", "mData": "masterDescription" ,"sClass": "left"},
          { "sTitle": "翻訳キー", "mData": "masterTrsKey" ,"sClass": "left"},
          { "sTitle": "操作", "mData": "_id" ,"sClass": "left"}
        ],
        "aoColumnDefs": [
          {
            "aTargets": [5],
            "mData": "操作",
            "mRender": function ( data) {
              var d = "<a href=\"/admin/master/detail/"+ data + "\" class=\"btn btn-default btn-sm\">詳細</a>";
              var e = "<a href=\"/admin/master/edit/"+ data + "\" class=\"btn btn-default btn-sm\">編集</a>";
              return d + e;
            }
          }
        ]
      });
    }
  });
}

function events() {

}

$(function () {

  // 画面表示
  render();

  // 注册事件
  events();
});