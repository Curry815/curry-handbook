/***
 * 需求：
 * 新建一个文件，座右铭.txt，内容是：人生苦短，我用Vue
 */

// 1.引入fs模块
const fs = require('fs');

// 2.写入文件
/** 
 *  语法： fs.writeFile(file, data[, options], callback)
    参数说明：
    file 文件名
    data 待写入的数据
    options 选项设置 （可选）
    callback 写入回调
    返回值： undefined 
*/
// 1.1 异步写入文件
fs.writeFile('./座右铭.txt', '人生苦短，我用Vue', err => {
    // err 写入失败：错误对象 ，写入成功；null 
    if (err) {
        console.log('写入失败');
        return;
    }
    console.log('写入成功');
})
console.log(1+1);
// 输出顺序：
// 2
// 写入成功 （异步的回调函数）


// 1.2 同步写入文件
fs.writeFileSync('./data.txt', 'test')