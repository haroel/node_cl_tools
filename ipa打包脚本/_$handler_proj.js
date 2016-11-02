'use strict';
// 处理工程

const FTP_SERVER = {
	    host: "192.168.60.13",
	    user: "moonton",
	    password: "moonton123"
	};

var ipa_build_core = require("./_$ipa_build_core.js")

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var spawn = child_process.spawn;
var exec = child_process.exec;

var trace = console.log

const ignoreFileFormat = [".svn",".DS_Store",".git","build"];

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

// 查找所有的plist文件并修改其版本号
function resetAllInfoPlist( dir ,exeVersion, buildVersion )
{
    let files = fs.readdirSync(dir);
    for (let fileName of files) 
    {
        if (!isIgnore(fileName))
        {
            if (fileName.indexOf("nfo.plist") >= 0)
            {
            	let plistFullPath = path.join(dir,fileName);

                let plistXmlContent = fs.readFileSync( plistFullPath ,"utf-8");
                let fileArray = plistXmlContent.split("\n");
                for (let i = 0; i < fileArray.length; i++)
                {
                    if (fileArray[i].indexOf("CFBundleShortVersionString") > 0 && exeVersion != "" )
                    {
                        let nextStr = fileArray[i+1];
                        fileArray[i+1] = nextStr.replace( /(\>)(.*)(\<)/,'$1'+ exeVersion +'$3')
                    }
                    if (fileArray[i].indexOf("CFBundleVersion") > 0 && buildVersion != "" )
                    {
                        let nextStr = fileArray[i+1];
                        fileArray[i+1] = nextStr.replace( /(\>)(.*)(\<)/,'$1'+ buildVersion +'$3')
                    }
                }
                let newContent = fileArray.join("\n");
                fs.writeFileSync( plistFullPath, newContent , 'utf8');
                trace( plistFullPath+ '  修改成功！' );
            }else
            {
                let stats = fs.lstatSync( path.join(dir,fileName) ); // 同步读取文件信息
                if (stats.isDirectory())
                {
                    resetAllInfoPlist( path.join(dir,fileName) , exeVersion , buildVersion )
                }
            }
        }
    }
}

// var PROJECT_DIR_NAME = "proj.ios_mac";
// var XCODE_PROJ_NAME = 'RSLG.xcodeproj';
// var PACKAGE_NAME = "com.ly.jlzz";
module.exports.handler = function ( targetConfigDatas , PROJECT_DIR_NAME, XCODE_PROJ_NAME , PACKAGE_NAME , 
								    configuration , dirname , build_Version)
{
	// 编译期生成目录
	let output_path = path.join( dirname , path.parse(process.argv[1]).name );
	let configLuaPath = dirname + "/ResIOS/config.lua";

	let xcodeproj_fullpath = path.join( dirname , PROJECT_DIR_NAME,  XCODE_PROJ_NAME );
	// app 输出目录 使用脚本文件名
	let build_path = path.join( output_path , configuration + "-iphoneos" );
	exec("rm -rf " + build_path);
	fs.mkdir( output_path , function(err){if (err) {}});
	trace(" \n 删除原有的app编译文件 \n");

	let resIos_content = fs.readFileSync( configLuaPath ,"utf-8");

	let ipa_file_paths = [];
	let fullVersion = "";
	let exeVersion = "";
	let buildVersion = build_Version;
	function getFullVersionSerial()
	{
	    if (fullVersion != "")
	    {return;}
	    fullVersion = "";
	    // 正则搜索exe版本号
	    let result = resIos_content.match( /ExeVersion\s*=\s*\"([^""]*)\"/m )
	    if(result)
	    {
	        exeVersion = result[1];
	        fullVersion += exeVersion;
	    }
	    let resList_content = fs.readFileSync( dirname + "/ResIOS/resList.lua","utf-8");
	    result = resList_content.match( /version\s*=\s*\"([^""]*)\"/m );
	    if(result)
	    {
	        fullVersion += "." + result[1];
	    }
	    if ( !buildVersion )
	    {
	    	buildVersion = exeVersion + ".0"
	    }
	}
	getFullVersionSerial();

	trace("EXE版本号：" + exeVersion);
	trace("打包版本号：" + fullVersion + "\n");
	trace("CFBundleShortVersionString :" + exeVersion);
	trace("CFBundleVersion :" + buildVersion);

	let gT1 = Date.now();
	function * getTargetInfo()
	{
		let i =0;
		while(i < targetConfigDatas.length)
		{
			yield targetConfigDatas[i];
			i++;
		}
	}
	let _getTargetInfo = getTargetInfo();
	function doIndex()
	{
		let datainfo = _getTargetInfo.next();
		if ( datainfo && !datainfo.done)
		{
			let info = datainfo.value;
			// 替换g_server和g_channel
		    let newConfigLua = resIos_content.replace( /(server\s*=\s*)(.+)/m , '$1' + info.g_server);
		    if (info.g_channel && info.g_channel != "" )
		    {
		        newConfigLua = newConfigLua.replace(  /(channel\s*=\s*\")([^""]*)(\")/m , '$1' + info.g_channel + '$3');
		    }
		    trace("\n**********************************开始打包 target " + info.targetName + "**********************************\n");
			fs.writeFileSync( configLuaPath , newConfigLua , 'utf8');
		    trace("重新写入 config.lua文件 成功 \n" , newConfigLua );

		    let targetName = info.targetName
    		let ipa_path = output_path + "/" + info.ipa_pre_name + fullVersion + '.ipa';
    		let app_path = build_path + "/" + targetName +".app";

			if (info.need_clean == true )
		    {
		    	ipa_build_core.buildWithClean( xcodeproj_fullpath , targetName , configuration ,
		    			 output_path , app_path , ipa_path)
		    	.then(function()
		    	{
		    		ipa_file_paths.push( ipa_path );
		    		doIndex();
		    	})
		    	.catch(function(error)
		    	{
		    		trace("打包错误" +error);
		    		throw new Error("打包错误" +error);
		    	})
		    }else
			{
				ipa_build_core.build( xcodeproj_fullpath , targetName , configuration , output_path , app_path , ipa_path)
		    	.then(function()
		    	{
		    		ipa_file_paths.push( ipa_path );
		    		doIndex();
		    	})
		    	.catch(function(error)
		    	{
		    		trace("打包错误" +error);
		    	    throw new Error("打包错误" +error);
		    	})
			}
		}else
		{
			let notificationStr = "：）Success！ " + fullVersion +" ipa包已全部生成完毕！\n 打包耗时: " + Math.floor( (Date.now() - gT1)/(1000 * 60) ) + "分钟\n";
	        trace(notificationStr);
	        exec("open " + output_path);

			exec(`osascript -e 'display notification "${notificationStr}" with title "ipa 已构建完毕"'`)
	        require("./_$uploadDSYMToBugly.js").Upload( path.join(build_path ,"RSLG_dist.app.dSYM" ) , PACKAGE_NAME , exeVersion );

			uploadIPAToFTPServer(ipa_file_paths);
		}
	}
	resetAllInfoPlist(  path.join(dirname, PROJECT_DIR_NAME)  , exeVersion , buildVersion);
	doIndex();
}

function uploadIPAToFTPServer( files)
{
	trace("\n ********************************************** 上传ipa文件到 ftp **********************************************", FTP_SERVER, files, "\n");
	// 使用ftp模块上传ipa到ftp服务器
	let Client = null;
	try {
		let Client = require('ftp');
		for (let filepath of files)
		{
			let ftp = new Client();
			ftp.on('ready', function() 
				{
					let fileName = path.basename(filepath);
			    	ftp.put(filepath, fileName, function(err)
			    	{
				      	if (err) 
			      	    {
			      	    	trace(err);
			      	    }
				        ftp.end();
			    	});
			    });
			ftp.connect(FTP_SERVER);
		}
	}catch(e)
	{
		trace(e);
	}

}
