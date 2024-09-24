const fs = require('fs');

// 1.1 异步写入文件
fs.appendFile('./座右铭.txt', '，择其善者而从之，其不善者而改之。', err => {
  if (err) {
    console.log('写入失败~~');
    return;
  }
  console.log('写入成功~~');
});

// 1.2 同步写入文件
fs.appendFileSync('./座右铭.txt', '\r\n温故而知新，可以为师矣。')

// 1.3 追加写入文件 { flag: 'a' }
fs.writeFile('./座右铭.txt', '111111', { flag: 'a' }, err => {
    if (err) {
        console.log('写入失败');
        return;
    }
    console.log('写入成功');
});