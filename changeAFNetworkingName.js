'use strict';
var trace = console.log;

var fs = require("fs");

var path = require("path");

let dir_path = '/Users/howe/Documents/RSLG/trunk/src/Client/cocos2d/external/plugin/Photo/AFNetworking';

let files = fs.readdirSync(dir_path);

for (let fileName of files)
{
	let fullpath = path.join(dir_path,fileName);
	let codeContent = fs.readFileSync( fullpath ,"utf-8");
	// 查找AF并替换成A_F
	let reg = /AF/gm;
	codeContent = codeContent.replace(reg,"A_F");
	fs.writeFileSync( fullpath ,codeContent,"utf-8");
}