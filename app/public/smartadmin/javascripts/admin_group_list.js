"use strict";

function render() {

  smart.doget("/admin/group/list.json", function(err, result) {

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
        "aaData": result.items,
        "aoColumns": [
          { "sTitle": "#","mData": "_id","sClass": "left"},
          { "sTitle": "组名", "mData": "name" ,"sClass": "left"},
          { "sTitle": "描述", "mData": "description" ,"sClass": "left"},
          { "sTitle": "类型", "mData": "type" ,"sClass": "left"},
          { "sTitle": "经理一览", "mData": "owners" ,"sClass": "left"},
          { "sTitle": "操作", "mData": "_id" ,"sClass": "left"}
        ],
        "aoColumnDefs": [
          {
            "aTargets": [5],
            "mData": "操作",
            "mRender": function ( data) {
              var d = "<a href=\"/admin/group/detail/"+ data + "\" class=\"btn btn-default btn-sm\">詳細</a>";
              var e = "<a href=\"/admin/group/edit/"+ data + "\" class=\"btn btn-default btn-sm\">編集</a>";
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