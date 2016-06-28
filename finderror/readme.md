需要安装
`npm install mysql`
`npm install express`


为什么有public目录，目的是你可以把Cocos creator build出来的html相关文件放在这个目录，这样可以直接用node.js搭建的服务器来访问网页

1. 服务器配置在config.js里面
2. 数据库是mysql，所以你需要`npm install mysql`来安装mysql的nodejs库和mysql数据库。
   傻瓜点的做法：如果是windows请安装wamp，mac osx请安装mamp
3. 在wamp里面打开phpmyadmin，新建一个数据库和数据库表，库的名称和表名称按照config.js来配置

数据库配置方式可参看截图