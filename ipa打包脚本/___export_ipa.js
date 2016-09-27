'use strict';
// 生成 ipa的nodejs脚本  - autor by i.howe

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 调用方式如下 后面可加可选参数 参数1表示build号
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
        need_clean : false,

        g_server : "4",
        g_channel : "ios_longyuan"
    }
];

var PROJECT_DIR_NAME = "proj.ios_mac";
var XCODE_PROJ_NAME = 'RSLG.xcodeproj';
var PACKAGE_NAME = "com.ly.jlzz";

///////////////////////////////
var trace = console.log
trace("\n\n开始运行打包脚本 \n 参数：",process.argv)

let handler_proj = require("./_$handler_proj.js");
handler_proj.handler( targetConfigDatas , PROJECT_DIR_NAME, XCODE_PROJ_NAME , PACKAGE_NAME ,
                     "Release" , __dirname , process.argv[2] )





