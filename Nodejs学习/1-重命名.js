const fs = require('fs');

// 创建文件夹
// fs.mkdir('./Nodejs学习/code', (err) => {
//     if (err) {
//         console.log('创建失败');
//         return;
//     };
//     console.log('创建成功');
// });

// 读取文件夹
const files = fs.readdirSync('./code');

// 遍历数组
files.forEach(item => {
    // 拆分文件名
    let newItem = item.split('-');
    let [num, name] = newItem;
    // 判断
    if (Number(num) < 10) {
        num = '0' + num;
    }
    // 创建新的文件名
    let newName = num + '-' + name;
    console.log(newName);
    // 重命名  
    fs.renameSync(`./code/${item}`, `./code/${newName}`)
})
