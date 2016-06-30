
var config = require('./config.js');
var url = require("url");
var querystring = require('querystring');

var findError = require("./findErrorLine.js");

//?:95: attempt to index a nil valuestack traceback:?:106: in function <?:103>?:95: in function <?:69>(tail call): ??:1509: in function <?:1508>(tail call): ??:48: in function 'setCurState'?:416: in function 'tryEnterState'?:1826: in function <?:1780>(tail call): ??:48: in function 'setCurState'?:416:
// in function 'tryEnterState'?:372: in function 'resetSoldierState'?:179: in function 'checkDefendSoldierReach'?:90: in function 'update'?:356: in function 'update'?:257: in function 'update'?:392: in function 'update'?:554: in function 'updateDetailLayer'?:473: in function 'update'?:1191: in function 'update'?:329: in function 'update'?:64: in function <?:58>
module.exports = function (app)
{
    app.get('/', function (req, res)
    {

        let version = req.query["version"].match(/\d+\.\d+/)[0];
        let errorlog = req.query["errorlog"];

        let reg = /\'(\w+)\'\?\:(\d+)/gm;
        console.log(">>> client Ip %s version %s  errorlog %s",req.ip,version,errorlog);

        let params = [];

        let execRets = reg.exec(errorlog);
        while(execRets)
        {
            params.push({func:execRets[1],num:execRets[2]});
            execRets = reg.exec(errorlog);
        }

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
};