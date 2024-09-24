// 导入http模块
const http = require('http');

// 创建http服务对象
const server = http.createServer((request, response) => {
    let { method } = request;
    let { pathname } = new URL(request.url, 'http://127.0.0.1');
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    if (method === 'GET' && pathname === '/login') {
        response.end('登录页面');
    } else if (method === 'GET' && pathname === '/reg') {
        response.end('注册页面');
    } else {
        response.end('Not Found');
    }
});

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
