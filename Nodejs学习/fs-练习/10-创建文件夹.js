const fs = require('fs');

fs.mkdir('./html', (err) => {
    if (err) {
        console.log('创建失败');
        return;
    }
    console.log('创建成功');
})

// 递归创建
fs.mkdir('./a/b/c', {recursive: true}, (err) => {
    if (err) {
        console.log('创建失败');
        return;
    }
    console.log('创建成功');
})

// 读取文件夹
fs.readdir('../面试题', (err, files) => {
    if (err) {
        console.log('读取失败');
        return;
    }
    console.log(files);
})

fs.readdir('./', (err, files) => {
    if (err) {
        console.log('读取失败');
        return;
    }
    console.log(files);
})

// 删除文件夹
fs.rmdir('./html', (err) => {
    if (err) {
        console.log('删除失败');
        return;
    }
    console.log('删除成功');
})

// 递归删除
fs.rm('./a', {recursive: true}, (err) => {
    if (err) {
        console.log('删除失败');
        return;
    }
    console.log('删除成功');
})