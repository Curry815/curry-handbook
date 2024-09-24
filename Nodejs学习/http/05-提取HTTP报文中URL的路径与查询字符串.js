// 导入http模块
const http = require('http');
// 1.导入url模块
const url = require('url');

// 创建http服务对象
const server = http.createServer((request, response) => {
    // 2.解析request.url
    // console.log(request.url);
    let res = url.parse(request.url, true);
    console.log(res);
    // 路径
    let pathname = res.pathname;
    console.log(pathname);
    // 查询字符串
    let query = res.query.keyword;
    console.log(query);
    
    response.end('hello world');
});

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
