const fs = require('fs');
const path = require('path');

// 写入文件
fs.writeFileSync(__dirname + '/index.html', 'love');
console.log(__dirname);

// resolve 拼接规范的绝对路径
console.log(path.resolve(__dirname, './index.html')); // 相对路径
console.log(path.resolve(__dirname, 'index.html')); // 相对路径
// console.log(path.resolve(__dirname, '/index.html')); // 绝对路径


// sep 路径分隔符
console.log(path.sep); // \
console.log(__filename); // 文件的绝对路径

// parse 解析路径并返回对象
let str = 'E:\\code\\curry-handbook\\Nodejs学习\\path\\path.js';
console.log(path.parse(str));
/**{
    root: 'E:\\',
    dir: 'E:\\code\\curry-handbook\\Nodejs学习\\path',
    base: 'path.js',
    ext: '.js',
    name: 'path'
  }
*/

// basename 获取路径的基础名称
console.log(path.basename(str)); // path.js

// dirname 获取路径的目录名称
console.log(path.dirname(str)); // E:\code\curry-handbook\Nodejs学习\path

// extname 获取路径的扩展名
console.log(path.extname(str)); // .js