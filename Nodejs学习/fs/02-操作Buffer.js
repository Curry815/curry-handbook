// Buffer 与字符串的相互转换
let buf = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
console.log(buf.toString()); // iloveyou utf-8

// []
let buf2 = Buffer.from('hello');
console.log(buf2[0].toString(2)); // 01101000
buf2[0] = 95;
console.log(buf2.toString()); // _ello


