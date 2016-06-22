/***
 * Author： i.howe  2016/05/23
 * 作用: 读取csd并把其中的中文换成???
 * 读取cocostudio目录的所有文件，并将该目录下的所有图片和csd加入到ui.ccs文件 ,
 * 避免每次新加资源都要手动导入的问题
 *
 * 本脚本运行环境依赖Node.js，除此之外不依赖任何第三方模块，windows和mac都可运行
 *
 * 使用方式命令行： node ${ui.ccs目录}/studio_helper_csd.js
 */

'use strict'; // 采用es6的js语法
var uiPath = __dirname + "/cocosstudio"; // cocosstudio目录路径

var trace = console.log;
var fs = require('fs');
var files = fs.readdirSync(uiPath);
let num = files.length;
// 判断是否有中文字符的正则表达式
var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]+/gm;
var count = 0;
for ( let index = 0; index < num; index++)
{
    let fileName = files[index];
    if (fileName.indexOf("csd") > 0)
    {
        let path = uiPath + "/" + fileName;
        fs.readFile( path, "utf-8" ,function (err,data)
        {
            let csd_content = data;
            // 判断是否有中文
            if (reg.test(csd_content))
            {
                let newContent = csd_content.replace(reg, "???");
                // fs.writeFileSync(path, newContent , 'utf8');
                fs.writeFile(path, newContent , 'utf8' ,(err,data)=>{
                    if (err)
                    {
                        trace("保存失败");
                        return
                    }
                    trace( fileName + " 包含中文，中文部分将被替换???，重新保存成功");
                });
                count++;
            }
        });
    }
}
process.on('exit', function () {
    trace("一共替换" + count + "个csd文件");
});
