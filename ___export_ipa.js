'use strict';
// 生成 ipa的nodejs脚本  - autor by i.howe

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 调用方式如下 后面可加可选参数 参数1表示build号；参数2表示是否显示构建log； 参数3表示Release/Debug
// node $folder_path/___export_ipa.js
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// targetConfigDatas 编译前文件的配置项，可修改
var targetConfigDatas = [
    {
        targetName : "RSLG",
        ipa_pre_name : "jlzz_dev_chinatest_",
        need_clean : true,

        g_server : "1",
        g_channel : "ios_longyuan"
    },
    {
        targetName : "RSLG",
        ipa_pre_name : "jlzz_dev_9999_",
        need_clean : false,

        g_server : "4",
        g_channel : "ios_longyuan"
    },
    {
        targetName : "RSLG_dist",
        ipa_pre_name : "jlzz_dist_appstore_",
        need_clean : true,

        g_server : "4",
        g_channel : "ios_longyuan"
    }
];

var PROJECT_DIR_NAME = "proj.ios_mac";
var XCODE_PROJ_NAME = 'RSLG.xcodeproj';

///////////////////////////////
var trace = console.log
trace("\n\n开始运行打包脚本 \n 参数：",process.argv)

var showCompileLog = true;     // 是否显示编译期log
var configuration = "Release"; // debug或者Release版本
var buildVersion = "";

if (process.argv[2])
{
    buildVersion = process.argv[2]
}

if (process.argv[3] == "false")
{
    showCompileLog = false;
}else if (process.argv[3] == "true");
{
    showCompileLog = true;
}

if ( process.argv[4] === "Release" || process.argv[4] === "Debug" )
{
    configuration = process.argv[4];
}

var fs = require('fs');
var path = require('path');

var child_process = require('child_process');

var resIos_content = fs.readFileSync( __dirname + "/ResIOS/config.lua","utf-8");

var spawn = child_process.spawn;
var exec = child_process.exec;

var xcodeproj_fullpath = path.join( __dirname , PROJECT_DIR_NAME,  XCODE_PROJ_NAME );
// ipa输出目录
var output_path = path.join( __dirname , path.parse(process.argv[1]).name );
trace("ipa 输出目录 :",output_path);

// __dirname + '/___export_ORC_ipa';
exec("rm -rf " + output_path + "/" + configuration + "-iphoneos");
fs.mkdir( output_path,function(err){if (err) {}});
trace(" \n 删除原有的app编译文件 \n");

var fullVersion = "";
var exeVersion = "";

function getFullVersionSerial()
{
    if (fullVersion != "")
    {return;}
    fullVersion = "";
    // 正则搜索exe版本号
    var result = resIos_content.match( /ExeVersion\s*=\s*\"([^""]*)\"/m )
    if(result)
    {
        exeVersion = result[1];
        fullVersion += exeVersion;
    }
    var resList_content = fs.readFileSync( __dirname + "/ResIOS/resList.lua","utf-8");
    result = resList_content.match( /version\s*=\s*\"([^""]*)\"/m );
    if(result)
    {
        fullVersion += "." + result[1];
    }
}
getFullVersionSerial();

trace("EXE版本号：" + exeVersion);
trace("打包版本号：" + fullVersion + "\n");
trace("CFBundleShortVersionString :" + exeVersion);
trace("CFBundleVersion :" + buildVersion);

// 清理target
function cleanXcodeTarget( targetName )
{
    // xcodebuild -project $projpath -scheme $targetName -configuration Release clean
    var params = [
        '-project', xcodeproj_fullpath,
        '-scheme', targetName,
        '-configuration', configuration,
        'clean'
    ];
    trace("\n开始清理工程 target " + targetName)
    var free = spawn('xcodebuild', params);
    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {
        // console.log(' ' + data);
    });
    // 捕获标准错误输出并将其打印到控制台
    free.stderr.on('data', function (data) {
        console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件
    free.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        trace("工程清理完成 target " + targetName + "\n")
        eventDispatcher.emit("cleanComplete");
    });
}
// 生成.app 文件
function generalArchive( targetName )
{
    var params = [
        '-project', xcodeproj_fullpath,
        '-scheme', targetName,
        '-configuration', configuration,
        "SYMROOT=" + output_path
    ];
    var free = spawn('xcodebuild', params);
    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {

                    // console.log("-" + data);

        if (data.indexOf("SUCCEEDED") > 1)
        {
            console.log("-" + data);
            return;
        }
        if (showCompileLog == true)
        {
            console.log("Xcodebuild is running！");
        }
    });
    // 捕获标准错误输出并将其打印到控制台
    free.stderr.on('data', function (data) {
        console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件
    free.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        eventDispatcher.emit("archiveComplete");
    });
}
function exportToIpa( targetName ,ipa_pre_name)
{
    let _tag = "/" + configuration + "-iphoneos/";
    let ipa_path = output_path + "/" + ipa_pre_name + fullVersion + '.ipa';
    // 执行xcrun命令
    var params = [
        '-sdk', 'iphoneos', 'PackageApplication',
        '-v', output_path + _tag + targetName +".app",
        '-o', ipa_path
    ];
    trace("导出ipa包 " + ipa_path + " begin")
    var free = spawn('xcrun', params);
    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {
        console.log(" " + data);
    });
    // 捕获标准错误输出并将其打印到控制台
    free.stderr.on('data', function (data) {
    console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件
    free.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        eventDispatcher.emit("exportComplete");
    });
}
// 事件监听
var EventEmitter = require('events').EventEmitter;
var eventDispatcher = new EventEmitter();
eventDispatcher.on( "cleanComplete",function ()
{
    var info = targetConfigDatas[__index];
    generalArchive(info.targetName);
});
eventDispatcher.on( "archiveComplete",function ()
{
    var info = targetConfigDatas[__index];
    exportToIpa(info.targetName,info.ipa_pre_name);
});
eventDispatcher.on( "exportComplete",function ()
{
    var info = targetConfigDatas[__index];
    trace(info.targetName + " ipa包已成功生成 \n");
    __index++;
    doIndex()
});
var gT1 = Date.now();
var __index = 0;
function doIndex()
{
    var info = targetConfigDatas[__index]
    if (!info)
    {
        let deltaTime = Date.now() - gT1;
        trace("ipa 包已全部生成完毕！\n打包总耗时: "+ Math.floor( deltaTime/(1000 * 60) ) + "分钟\n");
        exec("open " + output_path);
        return;
    }
    // 替换g_server和g_channel
    var newConfigLua = resIos_content.replace( /(server\s*=\s*)(.+)/m , '$1' + info.g_server);
    if (info.g_channel && info.g_channel != "" )
    {
        newConfigLua = newConfigLua.replace(  /(channel\s*=\s*\")([^""]*)(\")/m , '$1' + info.g_channel + '$3');
    }

    trace("\n**********************************开始打包 target " + info.targetName + "**********************************\n");
    fs.writeFileSync( __dirname + "/ResIOS/config.lua" , newConfigLua , 'utf8');
    trace("重新写入 config.lua文件 成功 \n" , newConfigLua );
    if( info.need_clean)
    {
        cleanXcodeTarget(info.targetName);
    }else
    {
        generalArchive(info.targetName);
    }
}

// 忽略文件格式
var ignoreFileFormat = [".svn",".DS_Store",".git","build"];
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
// 查找所有的plist文件并修改其版本号
function resetAllInfoPlist(path)
{
    var files = fs.readdirSync(path);
    for (var fileName of files) {
        if (!isIgnore(fileName))
        {
            if (fileName.indexOf("nfo.plist") >= 0)
            {
                var plistXmlContent = fs.readFileSync(path + "/" + fileName,"utf-8");
                var fileArray = plistXmlContent.split("\n");
                for (var i = 0; i < fileArray.length; i++)
                {
                    if (fileArray[i].indexOf("CFBundleShortVersionString") > 0 && exeVersion != "" )
                    {
                        var nextStr = fileArray[i+1];
                        fileArray[i+1] = nextStr.replace( /(\>)(.*)(\<)/,'$1'+ exeVersion +'$3')
                        // break;
                    }
                    if (fileArray[i].indexOf("CFBundleVersion") > 0 && buildVersion != "" )
                    {
                        var nextStr = fileArray[i+1];
                        fileArray[i+1] = nextStr.replace( /(\>)(.*)(\<)/,'$1'+ buildVersion +'$3')
                        // break;
                    }
                }
                var newContent = fileArray.join("\n");
                fs.writeFileSync( path + "/" + fileName , newContent , 'utf8');
                trace( path + "/" + fileName + '  修改成功！' );
            }else
            {
                let stats = fs.lstatSync(path + "/" + fileName); // 同步读取文件信息
                if (stats.isDirectory())
                {
                    resetAllInfoPlist(path + "/" + fileName)
                }
            }
        }
    }
}
resetAllInfoPlist(  path.join(__dirname, PROJECT_DIR_NAME) );

doIndex();
