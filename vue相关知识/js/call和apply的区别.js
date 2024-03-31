//call 和 apply 都是 JavaScript 中用于调用函数的方法，它们的作用类似，但在传递参数的方式上有一些区别：
// 参数传递方式：
/*call(thisArg, arg1, arg2, ...)：call 方法接受一个参数列表，每个参数对应函数调用时的一个参数。
apply(thisArg, [arg1, arg2, ...])：apply 方法接受两个参数，第一个参数是函数调用时的 this 值，第二个参数是一个数组或类数组对象，其中的每个元素对应函数调用时的一个参数。
*/
/*使用场景：
1.call 适用于已知参数列表的情况，方便在函数调用时直接传入参数。
2.apply 适用于参数数量不确定或者已经存在一个数组或类数组对象，方便将数组中的元素作为函数的参数传递。
举个例子，假设有一个函数 sum 用于计算两个数的和：
*/
function sum(a, b) {
    return a + b;
}
// 使用 call：
let result1 = sum.call(null, 1, 2); // result1 = 3
// 使用 apply：
let args = [1, 2];
let result2 = sum.apply(null, args); // result2 = 3
/*在这个例子中，sum.call(null, 1, 2) 和 sum.apply(null, [1, 2]) 都会返回 3，因为它们都是将参数 1 和 2 传递给 sum 函数并执行计算。
*/