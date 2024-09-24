const fs = require('fs');

// 文件重命名
fs.rename('./座右铭.txt', './论语.txt', err => {
    if (err) {
        console.log('操作失败');
        return;
    }
    console.log('操作成功');
})

// 文件移动
fs.rename('./论语-2.txt', '../../论语-3.txt', err => {
    if (err) {
        console.log('操作失败');
        return;
    }
    console.log('操作成功');
});