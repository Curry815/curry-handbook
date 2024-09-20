// 42.强制类型转换、隐式类型转换
console.log(true == 1); // true，隐式将布尔值转换为数字1
console.log(false == 0); // true
console.log(10 + "5"); // "105"

// 43. == 和 === 的区别
// 答案：重写a对象的toString()或valueOf()方法，使得这些方法在连续调用时返回不同的值
let a = {
    i: 1,

    valueOf: function () {
        return this.i++;
    },

    // 或者
    // toString: function () {
    //     return this.i++;
    // },
}
// 当a=?以下代码成立？
if (a == 1 && a == 2 && a == 3) {
    console.log('hello world');
}

// 45.堆栈内存存储
function fn() {
    obj = {m: 50};
    console.log(obj.m); // 50
}
const o = {m: 30};
fn(o);
console.log(o.m); // 30

// 47.如何判断JavaScript的数据类型
console.log(typeof null); // "object"
console.log(typeof function () {}); // "function"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
console.log(Object.prototype.toString.call({name: '张三'})); // "[object Object]"
function Person() {};
let person = new Person();
console.log(person instanceof Person); // true
console.log(Array.isArray([1,2,3])); // true

// 61.常见的consolo方法有哪些？js调试方法
console.log('a');
console.error('b');
console.warn('c');
console.info('d');
console.debug('e');
// 占位符打印
console.log('%o a', {a: 1});
console.log('%s a', 'xx');
console.log('%d d', 123);
// 打印任何对象，一般用于打印DOM节点
// console.dir(document.body);
// 打印表格
console.table({a: 1, b: 2});
// 计数
for (let i = 0; i < 10; ++i) {
    console.count('a');
}
// 分组
console.group('group1');
console.log('a');
console.group('group2');
console.log('b');
console.groupEnd('group2');
console.groupEnd('group1');
// 断言
console.assert(1 === 2, '断言失败');
// 调用栈
// function a() {
//     console.trace();
// }
// function b() {
//     a();
// }
// b();
// 内存占用
console.memory;



