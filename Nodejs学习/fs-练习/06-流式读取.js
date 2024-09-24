const fs = require('fs');

let rs = fs.createReadStream('./观书有感.txt');

// 每次取出64k数据后执行一次data回调
rs.on('data', chunk => {
    console.log(chunk);
    console.log(chunk.length);
    console.log(chunk.toString());
});

// 读取完毕后，执行end回调
rs.on('end', () => {
    console.log('读取完毕');
})