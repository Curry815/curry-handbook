let result = Number.MAX_VALUE + Number.MAX_VALUE;
console.log(result); // Infinity
console.log(isFinite(result)); // false


// NaN
console.log(0/0); // NaN
console.log(-0/+0); // NaN
console.log(5/0); // Infinity
console.log(-5/0); // -Infinity;

console.log(NaN == NaN); // false NaN is not equal to NaN

console.log(isNaN(NaN)); // true
console.log(isNaN(5)); // false，5是数值
console.log(isNaN('5')); // false，'5'是字符串，字符串可转为数值
console.log(isNaN('blue')); // true ，'blue'是字符串，不可转为数值
console.log(isNaN(true)); // false，true可转为数值1

/**
 * isNaN函数，判断参数是否“不是数值”，任何不能转换为数值的值都会导致这个函数返回true。
 * 可用于测试对象，首先调用对象的valueOf方法, 是否可转换为数值，如果转换结果是NaN，
 * 再调用toString方法，是否可转换为数值。
 */

console.log(Number("")); // 0
console.log(parseInt("")); // NaN
console.log(parseInt("10", 8)); // 第二个参数代表基数，8表示八进制
console.log(parseFloat("0908.5")); // 908.5, parseFloat只解析十进制，因此不能指定底数，且开头的零会被忽略


// 转换成字符串
// toString()方法可见于数值、布尔值、对象和字符串，但是null和undefined没有这个方法。
// toString()方法可以接受一个参数，表示输出的进制。
// 字符串数组的.raw属性取得每个字符串的原始内容

let genericSymbol = Symbol();
let otherSymbol = Symbol();
let fooSymbol = Symbol("foo");
let otherFooSymbol = Symbol("foo");
console.log(genericSymbol == otherSymbol); // false
console.log(fooSymbol == otherFooSymbol); // false

// Symbol()函数不能用作构造函数，与new关键字一起使用，如果想要使用符号包装对象，可以借用Object()函数
let mySymbol = Symbol();
let myWrappedSymbol = Object(mySymbol);
console.log(typeof myWrappedSymbol); // "object"

// 使用全局符号注册表
let fooGlobalSymbol = Symbol.for("foo");
console.log(fooGlobalSymbol); // Symbol(foo)
let otherFooGlobalSymbol = Symbol.for("foo");
console.log(fooGlobalSymbol === otherFooGlobalSymbol); // true
console.log(fooSymbol === fooGlobalSymbol); // false

// 同时使用两个叹号!!相当于调用了转型函数Boolean()，将符号值转换成布尔值
console.log(!!"blue"); // true
console.log(!!0); // false
console.log(!!NaN); // false
console.log(!!""); // false
console.log(!!12345); // true  

console.log(-1 * -1); // 1
console.log(Infinity  * 0); // NaN
console.log(Infinity * 2); // Infinity
console.log(Infinity * Infinity); // Infinity

console.log(NaN / Infinity); // NaN
console.log(Infinity / Infinity); // NaN
console.log(0 / 0); // NaN
console.log(1 / 0); // Infinity
console.log(Infinity / 0); // Infinity


// 指数级
console.log(Math.pow(3, 2)); // 9
console.log(3 ** 2); // 9

let squared = 3;
squared **= 2;
console.log(squared); // 9

console.log(Infinity + -Infinity); // NaN
console.log(-0 + +0); // 0   
console.log(-0 + -0); // -0

console.log(Infinity - Infinity); // NaN
console.log(-Infinity - -Infinity); // NaN
console.log(Infinity - -Infinity); // Infinity
console.log(-Infinity - Infinity); // -Infinity
console.log(+0 - -0); // 0
console.log(-0 - -0); // 0

let res = "Brick" < "alpha";
console.log(res); // true，因为字符串按照Unicode编码进行比较，大写字母的编码比小写字母的编码小
let res2 = "Brick".toLowerCase() < "alpha".toLowerCase();
console.log(res2); // false

let res3 = "23" < "3";
console.log(res3); // true，因为字符串按照Unicode编码进行比较，"2"的编码比"3"的编码小
let res4 = "23" < 3;
console.log(res4); // false，因为字符串"23"不能直接与数字3进行比较，需要先将其转换为数字
let res5 = "a" < 3;
console.log(res5); // false, 因为字符串“a”会转换为NaN, 任何关系运算符和NaN的结果都是false
console.log(NaN < 3); // false
console.log(NaN >= 3); // false


function fn() {
    const obj = {name: 'John'};
    console.log(obj);
}
fn();
