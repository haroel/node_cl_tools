
var config = require('./config.js');
var url = require("url");
var querystring = require('querystring');
var path = require("path");

var fs = require("fs");

var findError = require("./findErrorLine.js");

//?:95: attempt to index a nil valuestack traceback:?:106: in function <?:103>?:95: in function <?:69>(tail call): ??:1509: in function <?:1508>(tail call): ??:48: in function 'setCurState'?:416: in function 'tryEnterState'?:1826: in function <?:1780>(tail call): ??:48: in function 'setCurState'?:416:
// in function 'tryEnterState'?:372: in function 'resetSoldierState'?:179: in function 'checkDefendSoldierReach'?:90: in function 'update'?:356: in function 'update'?:257: in function 'update'?:392: in function 'update'?:554: in function 'updateDetailLayer'?:473: in function 'update'?:1191: in function 'update'?:329: in function 'update'?:64: in function <?:58>
module.exports = function (app)
{
    app.get('/', function (req, res)
    {
        let version = req.query["version"]; 
        if (!version)
        {
            console.log("<<<< result 访问错误");
            res.write("error !");
            res.end();
            return;
        }

        let errorlog = req.query["errorlog"];

        let reg = /\'(\w+)\'\?*\:(\d+)/gm;
        console.log(">>> client Ip %s version %s",req.ip,version);

        let params = [];

        let execRets = reg.exec(errorlog);
        while(execRets)
        {
            params.push({func:execRets[1],num:execRets[2]});
            execRets = reg.exec(errorlog);
        }
        console.log("参数",params);
        findError.search(version, params ,(result)=>{
            console.log("<<<< result ",result);
            res.write(result);
            res.end();
        })

    });

    app.get('/test', function (req, res)
    {
        console.log("client Ip %s",req.ip);
        res.write("test success!");
        res.end();

    });

    app.get('/versionList', function (req, res)
    {
        console.log("client Ip %s",req.ip);

        let list = findError.getVersionList();
        res.write( JSON.stringify(list) );
        res.end();
    });

    app.get('/errorlog', function (req, res)
    {
        console.log("client Ip %s",req.ip);
        let path11 = path.join(__dirname,"public","main.html")
        fs.readFile(path11,function(error,data)
        {
            if (error)
            {
                res.write("read file error");
                res.end()
                return;
            }
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data)
            res.end()
        });
    });
};