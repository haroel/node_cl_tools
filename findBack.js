'use strict'; // 采用es6的js语法
var ignoreFileFormat = [".svn",".DS_Store",".git"];       // 忽略文件格式
var fs = require("fs");
var path = require("path");

var trace = console.log;

function isIgnore(files) {

    for (var f of ignoreFileFormat)
    {
        if (files.indexOf(f) >= 0)
        {
            return true;
        }
    }
    return false;
}


function loopDir( dir_path, path_arr )
{
    try{
        let files = fs.readdirSync(dir_path);
        for (let filename of files)
        {
            if (isIgnore(filename) == false)
            {
                let fPath = path.join(dir_path, filename );
                let stats = fs.lstatSync( fPath ); // 同步读取文件信息
                if (stats.isDirectory())
                {
                    loopDir( fPath, path_arr )
                }else
                {
                    if (path.extname( filename ) === ".lua")
                    {
                        path_arr.push(fPath)
                    }
                }
            }
        }
    }catch (error)
    {
        console.log(error)
    }
}

let path11 = process.argv[2]
let files = [];
loopDir( path11,files);

let num = 0;
for (let filepath of files)
{

    let codeContent = fs.readFileSync( filepath ,"utf-8");

    let a = codeContent.match(/:retain\(/gm);
    let b = codeContent.match(/:release\(/gm);
    if (!a)
    {
        continue;
    }
    if (!b)
    {
        console.log("只有retain，没有release",filepath)
        continue;
    }
    if (a.length > b.length)
    {
        console.log("retain与release 数目不对",filepath)
    }

}

