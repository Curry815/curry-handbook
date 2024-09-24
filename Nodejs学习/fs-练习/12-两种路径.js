const fs = require('fs');

// 相对路径
fs.writeFileSync('./index.html', 'love');
fs.writeFileSync('index.html', 'love');
fs.writeFileSync('../index.html', 'love');

// 绝对路径
fs.writeFileSync('F:\index.html', 'love');
fs.writeFileSync('/index.html', 'love');