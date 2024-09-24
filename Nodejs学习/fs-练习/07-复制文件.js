const fs = require('fs');
const process = require('process');

// 方式一 readFile
// 读取文件内容
let data = fs.readFileSync('./观书有感.txt');
// 写入文件
fs.writeFileSync('./观书有感-2.txt', data);
console.log(process.memoryUsage()); // 24MB


// 方式二 流式操作
const rs = fs.createReadStream('./观书有感.txt');
const ws = fs.createWriteStream('./观书有感-3.txt');
rs.on('data', chunk => {
    ws.write(chunk);
}) 
rs.on('end', () => {
    console.log(process.memoryUsage());
})
// rs.pipe(ws);
