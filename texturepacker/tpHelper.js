 

var child_process = require('child_process');
var spawn = child_process.spawn;

function doPacker ( pndDir, outputName, textureFormat, textureType , imageFormat)
{
    let params = [
        '--smart-update', 
        '--texture-format', textureFormat,
        '--format', 'cocos2d',
        "--maxrects-heuristics" ,"best",
        '--enable-rotation',
        "--shape-padding" ,2,
        '--data', outputName + ".plist",
        '--sheet', outputName + "." + textureType,
        '--opt' , imageFormat,
        pndDir
    ];

    let free = spawn('TexturePacker', params);

    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {
        console.log(' ' + data);
    });
    // 捕获标准错误输出并将其打印到控制台
    free.stderr.on('data', function (data) {
        console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件
    free.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
    });
}
doPacker( __dirname + "/DialyReward", __dirname + "/testTP" , "pvr2ccz","pvr.ccz", "RGBA8888");