// 实现一个once函数，传入函数参数只执行一次
function once(fn) {
    let called = false; // 用来标记函数是否已经被调用过

    return function (...args) {
        if (!called) {
            called = true;
            return fn(...args);
        }
    };
}

const doSomething = once(() => console.log('只执行一次'));
doSomething();
doSomething(); // 不会执行