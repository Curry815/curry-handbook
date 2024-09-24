const fs = require('fs');

// 删除文件
// fs.unlinkSync('./code/02-操作Buffer.js');

// 读取文件夹
let files = fs.readdirSync('./code');
// console.log(files);
files.forEach((item, index) => {
    // 拆分文件名
    let newItem = item.split('-');
    let [num, name] = newItem;
    // 去掉数字前面的0
    let newNumber = Number(num) < 10 ? num = num.slice(1) : num;
    // 判断数字是否符合顺序，不符合就依次+1
    if (Number(newNumber) !== index + 1) {
        newNumber = index + 1;
    }
    // 重新补0
    newNumber = newNumber < 10 ? '0' + newNumber : newNumber;
    // 重新拼接文件名
    let newName = newNumber + '-' + name;
    console.log(newName);

    // 新创建一个文件夹
    // fs.mkdirSync('./code2');
    
    fs.renameSync(`./code/${item}`, `./code2/${newName}`);
})