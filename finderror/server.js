var express = require('express');
var config = require('./config.js');

// 启动服务器
module.exports.start = function (routes) {
    
    var app = express();
//设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
    app.use(express.static(__dirname + '/public'));
    var server = app.listen(config.SERVER_PORT,config.SERVER_IP,function (error)
    {
        if (error)
        {
            console.log(error);
            return;
        }
        var host = server.address().address;
        var port = server.address().port;
        console.log("服务器启动成功! http://%s:%s \n\n", host, port);
    });
    routes(app);
};