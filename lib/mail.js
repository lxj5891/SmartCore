/**
 * Mail:
 * Copyright (c) 2012 Author Name l_li
 */

var nodemailer = require('nodemailer')
  , mail = require('config').mail

/**
 * Setting:
 *  Set the authentication information such as e-mail.
 */
var transport = nodemailer.createTransport("SMTP", {
  auth: {
      user: mail.auth.user
    , pass: mail.auth.pass
  }
  , service: mail.service
  , debug: true
})

/**
 * Message:
 *  message body sample.
 */
// var message = {
//   // define transport to deliver this message
//   transport: transport, 
    
//   // sender info
//   from: 'lilin <r2space@gmail.com>',
    
//   // Comma separated list of recipients
//   to: '"Li Lin" <ri__rin@hotmail.com>',
    
//   // Subject of the message
//   subject: 'Nodemailer is unicode friendly ✔', //

//   headers: {
//     'X-Laziness-level': 1000,
//   },

//   // plaintext body
//   text: 'Hello to myself!',
    
//   // HTML body
//   html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
//        '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',
    
//   // An array of attachments
//   attachments:[
        
//     // String attachment
//     {
//       fileName: 'notes.txt',
//       contents: 'Some notes about this e-mail',
//       contentType: 'text/plain' // optional, would be detected from the filename
//     },
        
//     // Binary Buffer attachment
//     {
//       fileName: 'image.png',
//       contents: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
//                            '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
//                            'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
//       cid: 'note@node' // should be as unique as possible
//     },
        
//     // File Stream attachment
//     {
//       fileName: 'nyan cat ✔.gif',
//       filePath: __dirname+"/nyan.gif",
//       cid: 'nyan@node' // should be as unique as possible
//     }
//   ]
// }

var message = {
    "transport": transport
  , "from": "Smart <r2space@gmail.com>"
  , "to": ""
  , "subject": "完成注册，激活账号"
  , "headers": {
      "X-Laziness-level": 1000,
    }
  , "html": ""
}


/**
 * SendMail:
 *  You send an e-mail.
 */
exports.sendMail = function(email_, emailtoken_, host_, callback_) {

  console.log('Sending Mail : ' + email_);
  message.to = email_;

  var url = "http://" + host_ + "/register/complete?emailtoken=" + emailtoken_ 
    + "&email=" + encodeURIComponent(email_);

  message.html = "<a target='_blank' href='" + url + "'>" + url + "</a>";

  nodemailer.sendMail(message, function(error){
    if(error){
      console.log('Error occured');
      console.log(error.message);
      return callback_(error);
    }

    console.log('Message sent successfully!');
    transport.close(); // close the connection pool
    return callback_(null, "ok");
  });
}
