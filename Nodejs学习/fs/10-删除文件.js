const fs = require('fs');

// fs.unlink(path, callback) fs.unlinkSync(path)
fs.unlink('./观书有感.txt', err => {
    if (err) {
        console.log('删除失败');
        return;
    }
    console.log('删除成功');
});

// 调用rm方法 14.4
fs.rm('./观书有感-2.txt', err => {
    if (err) {
        console.log('删除失败');
        return;
    }
    console.log('删除成功');
});