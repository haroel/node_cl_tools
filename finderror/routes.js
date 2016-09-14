
var config = require('./config.js');
var url = require("url");
var querystring = require('querystring');
var path = require("path");

var fs = require("fs");

var findError = require("./findErrorLine.js");


function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

//?:95: attempt to index a nil valuestack traceback:?:106: in function <?:103>?:95: in function <?:69>(tail call): ??:1509: in function <?:1508>(tail call): ??:48: in function 'setCurState'?:416: in function 'tryEnterState'?:1826: in function <?:1780>(tail call): ??:48: in function 'setCurState'?:416:
// in function 'tryEnterState'?:372: in function 'resetSoldierState'?:179: in function 'checkDefendSoldierReach'?:90: in function 'update'?:356: in function 'update'?:257: in function 'update'?:392: in function 'update'?:554: in function 'updateDetailLayer'?:473: in function 'update'?:1191: in function 'update'?:329: in function 'update'?:64: in function <?:58>
module.exports = function (app)
{
    app.get('/ip', function (req, res)
    {
        res.write("IP:" + req.ip);
        res.end();
    });

    app.get('/getLog', function (req, res)
    {
        let version = req.query["version"]; 
        if (!version)
        {
            console.log("<<<< result 访问错误");
            res.write("error !");
            res.end();
            return;
        }

        let errorlog = new Buffer(req.query["errorlog"], 'base64').toString();
        let reg = /\'(\w+)\'\?*\:(\d+)/gm;
        console.log("\n >>> client Ip %s version %s Time: %s",req.ip,version , getNowFormatDate());

        let params = [];

        let execRets = reg.exec(errorlog);
        while(execRets)
        {
            params.push({func:execRets[1],num:execRets[2]});
            execRets = reg.exec(errorlog);
        }
        console.log("参数",params);
                let t1 = Date.now();
        // Promise + generator ES6写法
        // findError.search2(version, params)
        // .then(function(result)
        // {
        //     console.log("查询时间",Date.now()-t1)
        //     console.log("<<<< result ",result);
        //     res.write(result);
        //     res.end();
        // })
        // .catch(function (error)
        // {
        //     console.log("<<<< error result ",error);
        //     res.write(error);
        //     res.end();
        // })
        findError.search(version, params ,(result)=>{
            console.log("查询时间",Date.now()-t1)
            console.log("<<<< result ",result);
            res.write(result);
            res.end();
        })

    });

    app.get('/getVersionList', function (req, res)
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