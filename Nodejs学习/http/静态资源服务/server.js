/**
 * 创建一个HTTP服务，端口为9000，满足如下需求：
 * GET /index.html             响应 page/index.html 的文件内容
 * GET /css/app.css            响应 page/css/app.css 的文件内容
 * GET /images/logo.png        响应 page/images/logo.png 的文件内容
 */

// 导入http模块
const http = require('http');
const fs = require('fs');
const path = require('path');

// 声明一个mime对象
const mimes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    json: 'application/json'
}

// 创建http服务对象
const server = http.createServer((request, response) => {
    if (request.method !== 'GET' ) {
        response.statusCode = 405;
        response.end(`<h1>405 Method Not Allowed</h1>`);
        return;
    }
    // 获取请求url的路径
    let { pathname } = new URL(request.url, 'http://127.0.0.1');
    // 拼接文件路径
    let filePath = __dirname + '/page' + pathname;
    // 声明一个变量root  
    // let root = __dirname + '/../';
    // let filePath = root + pathname;
    // 读取文件 异步
    fs.readFile(filePath, (err, data) => {
        // 如果文件不存在
        if (err) {
            // 设置字符集
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            // 判断错误的代号
            switch (err.code) {
                case 'ENOENT':
                    response.statusCode = 404;
                    response.end(`<h1>404 Not Found</h1>`);
                    break;
                case 'EPERM':
                    response.statusCode = 403;
                    response.end(`<h1>403 Forbidden</h1>`);
                    break;
                default:
                    response.statusCode = 500;
                    response.end(`<h1>Internal Server Error</h1>`);
                    break;
            }
            return;
        }
        // 获取文件的后缀名
        let ext = path.extname(filePath).slice(1);
        // 获取对应的类型
        let type = mimes[ext];
        if (type) {
            // 匹配成功
            if (type === 'html') {
                response.setHeader('Content-Type', type + ';charset=utf-8');
            } else {
                response.setHeader('Content-Type', type);
            }
        } else {
            // 匹配失败 下载
            response.setHeader('Content-Type', 'application/octet-stream');
        }

        // 响应文件内容
        response.end(data);
    });
});

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务启动成功');
})
