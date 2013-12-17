"use strict";

function render() {

  smart.doget("/admin/user/list.json", function(err, result) {

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
          { "sTitle": "用户标识", "mData": "userName" ,"sClass": "left"},
          { "sTitle": "名", "mData": "first" ,"sClass": "left"},
          { "sTitle": "中间名", "mData": "middle" ,"sClass": "left"},
          { "sTitle": "姓", "mData": "last" ,"sClass": "left"},
          { "sTitle": "操作", "mData": "_id" ,"sClass": "left"}
        ],
        "aoColumnDefs": [
          {
            "aTargets": [5],
            "mData": "操作",
            "mRender": function ( data) {
              var d = "<a href=\"/admin/user/detail/"+ data + "\" class=\"btn btn-default btn-sm\">詳細</a>";
              var e = "<a href=\"/admin/user/edit/"+ data + "\" class=\"btn btn-default btn-sm\">編集</a>";
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