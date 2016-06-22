'use strict';
var trace = console.log;

var fs = require("fs");

var path = require("path");

// 1, fs  stream
//var rs = fs.createReadStream("/Users/howe/Desktop/Nodejs/Xee.dmg");
//var ws = fs.createWriteStream("/Users/howe/Desktop/Nodejs/Xee2.dmg");
//rs.pipe(ws);
//rs.on('end', function () {
//    trace("copy over");
//});

// 2. Path

trace( path.join('foo/', 'baz/', '../bar'));

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
                        callback(pathname);
                        next(i + 1);

                    }
                });
            } else
            {
                finish && finish();
            }
        }(0));
    });
}

travel("/Users/howe/Documents/公开文件夹",
    function (pathname) {
        trace(pathname);
        //nextFunc();
    },
    function () {
        trace("travel finish");
    }
);