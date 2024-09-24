// 导入http模块
const http = require('http');
const fs = require('fs');

// 创建http服务对象
const server = http.createServer((request, response) => {
    // 读取文件内容
    let html = fs.readFileSync(__dirname + '/10-table.html');
    response.end(html); // end()方法的参数可以是字符串或者Buffer
});

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
