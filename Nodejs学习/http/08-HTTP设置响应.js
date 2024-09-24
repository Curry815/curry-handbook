// 导入http模块
const http = require('http');

// 创建http服务对象
const server = http.createServer((request, response) => {
    // 设置响应状态码
    response.statusCode = 203;
    // 设置响应状态的描述
    response.statusMessage = 'is ok'; // 不能有中文
    // 设置响应头
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 设置响应体
    response.write('你好');
    response.write('世界');
    response.end(); // 只能有一个end()
});

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
