/***
 * Author： i.howe  2016/04/06
 *
 * 作用: 自动更新ccs文件
 *
 * 读取cocostudio目录的所有文件，并将该目录下的所有图片和csd加入到ui.ccs文件 ,
 * 避免每次新加资源都要手动导入的问题
 *
 * 本脚本运行环境依赖Node.js，除此之外不依赖任何第三方模块，windows和mac都可运行
 *
 * 使用方式命令行： node ${ui.ccs目录}/studio_helper.js
 */

'use strict'; // 采用es6的js语法

let currentRunPath = __dirname; // 当前脚本执行路径

var ccsFilePath = currentRunPath + "/ui.ccs";      // ccs文件路径
var uiPath      = currentRunPath + "/cocosstudio"; // cocosstudio目录路径

var ignoreFileFormat = [".svn",".DS_Store",".git"];       // 忽略文件格式


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

function getSpaceByNum(num)
{
    return "\t".repeat(num)
}


var __CSDfileInfos = ""
var __FoldersInfos = ""
var __csdNum = 0;
var __imgNum = 0;
var __startSpace = "\t".repeat(4);
var __stepSpace = "\t";

var fs = require('fs');

function loop_Dir(path,folderInfos,spaceNum)
{
    let files = fs.readdirSync(path);
    let num = files.length;
    for (var index = 0; index < num; index++)
    {
        var fileName = files[index];
        if (isIgnore(fileName) == false)
        {
            let stats = fs.lstatSync(path + "/" + fileName);
            if (stats.isDirectory())
            {
                __FoldersInfos += getSpaceByNum(spaceNum) + '<Folder Name="'+ fileName +'">\n';
                loop_Dir(path + "/" + fileName,__FoldersInfos,spaceNum+1);
                __FoldersInfos += getSpaceByNum(spaceNum) + "</Folder>\n";
            }
            else if (stats.isFile())
            {
                __FoldersInfos += getSpaceByNum(spaceNum) + '<Image Name="'+fileName+'" />\n';
                __imgNum++;
            }
        }
    }
}

var files = fs.readdirSync(uiPath);
let num = files.length;
for (var index = 0; index < num; index++)
{
    var fileName = files[index];
    if (isIgnore(fileName) == false)
    {
        if (fileName.indexOf("csd") > 0)
        {
            __CSDfileInfos = __CSDfileInfos + __startSpace + '<Project Name="'+ fileName +'" Type="Layer" />\n';
            __csdNum++;
        }
        else // 遍历目录
        {
            let path = uiPath
            let stats = fs.lstatSync(path + "/" + fileName); // 同步读取文件信息
            if (stats.isDirectory())
            {
                __FoldersInfos += __startSpace + '<Folder Name="'+ fileName +'">\n';
                loop_Dir(path + "/" + fileName, __FoldersInfos, 4);
                __FoldersInfos += __startSpace + "</Folder>\n";
            }
            else if (stats.isFile())
            {
                __imgNum++;
                __FoldersInfos += __startSpace + __stepSpace + '<Image Name="'+fileName+'" />\n';
            }
        }
    }
}
var content =
`<Solution>
    <PropertyGroup Name="ui" Version="2.2.8.0" Type="CocosStudio" />
    <SolutionFolder>
        <Group ctype="ResourceGroup">
            <RootFolder Name=".">\n`;
                content+=__FoldersInfos;
                content+=__CSDfileInfos;
                content+=
`            </RootFolder>
        </Group>
    </SolutionFolder>
</Solution>`;
trace(content)

trace("共查找出 csd文件 " + __csdNum + "个");
trace("共查找出 图片文件 " + __imgNum + "个");

fs.writeFile(ccsFilePath, content, function (err) {
    if (err) {
        console.log(err);
    } else {
         trace("文件写入成功 " + ccsFilePath)
    }
});


// require("./studio_helper_csd.js")
