var sync    = require('async')
  , csv     = require('csv')
  , menu    = require('../modules/mod_menu');

csv().from.path(__dirname+'/menus.csv').on('record', function(row, index){
	console.log(row);
		// menuid,menuname,url,type,icon,parent,sort

  var u = {
      "menuid": row[0]
    , "menuname": row[1]
    , "url" : row[2]
    , "type" : row[3]
    , "icon" : row[4]
    , "parent" : row[5]
    , "sort" : row[6]
  }

  // 添加用户
  menu.create(u, function(err, result) {

  });

}).on('end', function(count){
  console.log('Number of lines: ' + count);

  callback();
}).on('error', function(error){
  console.log(error.message);
});