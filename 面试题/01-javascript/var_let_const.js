// var
for (var i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 0); // 5 5 5 5 5
}

// let
for (let i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 0); // 0 1 2 3 4
}

/*** 执行的，
 * 而for循环中的i变量在循环结束后才被赋值为5。
 * 因此，当回调函数执行时，i的值已经是5了。
 */
/***
 * 1.事件循环：
 * JavaScript是单线程的，它使用事件循环来处理异步操作。
 * 当setTimeout被调用时，它会在当前执行栈清空后，
 * 在事件循环的下一个阶段执行回调函数。
 * 2.变量作用域：
 * 在for循环中，i是一个var声明的变量，它的作用域是整个函数。
 * 这意味着在循环结束后，i的值是5。
 * 3.闭包：
 * 在JavaScript中，setTimeout的回调函数是一个闭包，它会捕获并保持对i的引用。
 * 因此，当回调函数执行时，它访问的是i的最终值，而不是循环中的当前值。
 */



// const
const name = 'John';
// const name = 'Jane'; // 不允许重复声明

/**
 * const 声明的限制只适用于它指向的变量的引用。
 * 换句话说，如果const变量引用的是一个对象，那么修改这个对象内部
 * 的属性并不违反const的限制。
 *  */ 
const person = {};
person.name = 'John'; // OK

// const不能用来声明迭代变量（因为迭代变量会自增）
for (const i = 0; i < 5; ++i) {} // TypeError: 给常量赋值

/**
 * 如果只想用const声明一个不会被修改的for循环变量，可以使用const。
 * 也就是说，每次迭代只是创建一个新的变量。
 * 以下做法都是允许的。
*/
let i = 0;
for (const j = 7; i < 5; ++i) {
    console.log(j); // 7, 7, 7, 7, 7
}

for (const key in {a: 1, b: 2}) {
    console.log(key); // a, b
}

for (const value of [1, 2, 3]) {
    console.log(value); // 1, 2, 3
}


// 总结：let和const都是块级作用域，var是函数作用域