'use strict';
var trace = console.log;

var fs = require("fs");

var path = require("path");

let t1 = Date.now();
// 1, fs  stream
var rs = fs.createReadStream("/Users/howe/Documents/www/Photoshop_16_LS20.dmg");
var ws = fs.createWriteStream("/Users/howe/Documents/www/Photoshop_16_LS20_2.dmg");
rs.pipe(ws);
rs.on('end', function () {
   trace("copy over time ",Date.now() - t1 );

});

