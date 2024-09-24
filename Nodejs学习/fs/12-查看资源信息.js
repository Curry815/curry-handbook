const fs = require('fs');

fs.stat('./观书有感-3.txt', (err, data) => {
    if (err) {
        console.log('操作失败');
        return;
    };
    console.log(data);
    console.log(data.isFile()); // 判断是否是文件
    console.log(data.isDirectory()); // 判断是否是文件夹
});