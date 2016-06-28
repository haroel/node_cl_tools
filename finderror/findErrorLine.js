'use strict';
var trace = console.log;

var fs = require("fs");

var path = require("path");

let dir_path = "/Users/howe/Documents/RSLG/branches/branch_0.2.0.";

const ignoreFileFormat = [".svn",".DS_Store",".git"];       // 忽略文件格式
function isIgnore(files)
{
    for (let f of ignoreFileFormat)
    {
        if (files.indexOf(f) >= 0)
        {
            return true;
        }
    }
    return false;
}


module.exports.search = function ( version, params , finishcallback )
{
    let result = "";
    let dirPath = dir_path + version + "/Client/Resources/lua";
    function travel(dir, callback, finish)
    {
        fs.readdir(dir, function (err, files)
        {
            (function next(i)
            {
                if (i < files.length)
                {
                    var pathname = path.join(dir, files[i]);

                    fs.stat(pathname, function (err, stats)
                    {
                        if (stats.isDirectory())
                        {
                            travel(pathname, callback, function ()
                            {
                                next(i + 1);
                            });
                        } else
                        {
                            if (path.extname(pathname) === ".lua")
                            {
                                fs.readFile( pathname ,"utf-8", (error,codeContent)=>
                                {
                                    let codeArr = codeContent.split("\n");
                                    let hasfind = false;
                                    for(let i = 0;i < codeArr.length;i++)
                                    {
                                        let lineStr = codeArr[i];
                                        if ( lineStr.length > 0 && (i+1) === parseInt(params[0].num) && lineStr.indexOf(params[0].func) >= 0 )
                                        {
                                            result += "错误方法文件位置：" + pathname.split("RSLG")[1] + "\n";
                                            for (let obj of params)
                                            {
                                                result += "function: " + obj.func + "  num:" + obj.num + "\n";
                                            }
                                            callback(result);
                                            hasfind = true;
                                        }
                                    }
                                    if (hasfind)
                                    {
                                        trace("hasfind true")
                                    }
                                    next(i + 1);
                                });
                            }else
                            {
                                next(i + 1);
                            }

                        }
                    });
                } else
                {
                    finish && finish();
                }
            }(0));
        });
    }
    travel( dirPath, (value)=>
    {
        result=value;
    } , ()=>
    {
        if (result.length < 1)
        {
            result = "没有找到错误文件";
        }
        finishcallback(result);
    } );

    //
    //function doSearch(dir)
    //{
    //    trace("dir ",dir);
    //    let files = fs.readdirSync(dir);
    //
    //
    //    for (let fileName of files)
    //    {
    //        if (isIgnore(fileName) == false)
    //        {
    //            let fullpath = path.join(dir,fileName);
    //            fs.stat( fullpath , (err,stats)=> {
    //                if (stats.isDirectory())
    //                {
    //                    doSearch(fullpath);
    //                }else
    //                {
    //                    fs.readFile( fullpath ,"utf-8", (error,codeContent)=>{
    //                        let codeArr =codeContent.split("\n");
    //                        trace("行数 ", codeArr.length);
    //                        for(let i = 0;i < codeArr.length;i++)
    //                        {
    //                            let lineStr = codeArr[i];
    //                            if ( lineStr.length > 0 && (i+1) === params[0].num && lineStr.indexOf(params[0].func) >= 0 )
    //                            {
    //                                trace("!!!!! ",fullpath);
    //                                result += "错误方法文件位置：" + fullpath + "\n";
    //
    //                                for (let obj of params)
    //                                {
    //                                    result += "function: " + obj.func + "  num:" + obj.num + "\n";
    //                                }
    //                                callback(result);
    //                                return;
    //                            }
    //                        }
    //                    });
    //                }
    //            } );
    //        }
    //    }
    //}
    //doSearch(dirPath);
};





