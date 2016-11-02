'use strict';
// 给rtx发送请求
//
// http://192.168.60.101:8012/sendnotify.cgi?receiver=haohe&msg=hello
// 

var qs = require('querystring');  
var content = qs.stringify({
	receiver:"jonyu,marszhou,haohe,markhuang,montehuang,xinliyu,yinglihan,yizeng,hangfanshi,qizhao,timeechen,merlinwang,jieli,junjiezhou,houdongchen,kaisheng",
	msg : "ipa包已构建完毕"
});  
var options = {
   host: '192.168.60.101',
   port: 8012,
   path: '/sendnotify.cgi',
   method: 'POST',
   headers: {  
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': content.length 
    } 
};

var http = require('http');
var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
    res.on('end',function(chunk){
        console.log("body: " + chunk);
    })
});
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
}); 
req.write(content); 
req.end();
