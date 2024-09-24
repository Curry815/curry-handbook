// 1.导入http模块
const http = require('http');

// 2.创建http服务对象
const server = http.createServer((request, response) => {
    // 获取请求的方法
    console.log(request.method);
    // 获取请求的url
    console.log(request.url); // 只包含url中的路径和查询字符串
    // 获取请求的http协议的版本号
    console.log(request.httpVersion);
    // 获取HTTP请求头
    console.log(request.headers); // headers是一个对象，属性名都是小写
    console.log(request.headers.host);
    
    response.end('http');
});

// 3.监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
