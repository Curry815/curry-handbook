const Promise1 = Promise.resolve(1);
Promise1.then((res) => {
    console.log('a1:', res);
}).then((res) => {
    console.log('a2:', res);
})

const Promise2 = Promise.resolve(2);
Promise2.then((res) => { console.log('b1:', res); });
Promise2.then((res) => { console.log('b2:', res); });

// res:1
function fn1(res) {
    console.log('a1:', res);
    return 1; 
}
fn1();

// res:2
function fn3(res) {
    console.log('a2:', res);
    return 2;
}
fn3();

// res:2
function fn4(res) {
    console.log('a2:', res);
    return 2;
}
fn4();

// res:undefined
function fn2(res) {
    console.log('a2:', res);
    return undefined;
}
fn2();

// 输出顺序：
// a1: 1
// b1: 2
// b2: 2
// a2: undefined

console.log(1);
Promise.resolve().then(() => {
    console.log(2);
    setTimeout(() => {
        console.log(3);
    }, 0);
});
setTimeout(() => {
    console.log(4);
    new Promise((resolve) => {
        console.log(5);
        resolve();
    }).then(() => {
        console.log(6);
    })    
}, 0);
console.log(7);

// 输出顺序：1 7 2 4 5 6 3

Promise.resolve().then(() => {
    console.log(0);
    return Promise.resolve(4);
}).then((res) => {
    console.log(res);
});

Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
});

// 输出顺序：0 1 2 3 4 5

const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(5);
            resolve(6);
            console.log(p);

            // resolve(6);会被解析成以下代码：
            // const p = new Promise((resolve, reject) => {
            //     resolve(6);
            // });
            
            // p.then(result => {
            //     console.log(result); // 这里输出1，因为这个p变量的值被重新赋值了
            // });
        }, 0);
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);
    });
}));

first().then((arg) => {
    console.log(arg);
});

console.log(4);

// 输出顺序：3 7 4 1 2 5 Promise { 1 }

let a;
let b = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
        resolve();
    }, 1000);
}).then(() => {
    console.log(2);
});

a = new Promise(async (resolve) => {
    console.log(a);
    await b;
    console.log(a);
    console.log(3);
    await a;
    resolve(true);
    console.log(4);
});

console.log(5);

// 输出顺序：1 undefined 5 "等待一秒" 2 Promise { <pending> } 3


const promiseA = Promise.resolve(1);
promiseA.then((res) => {
    console.log('a:', res);
}).then((res) => {
    console.log('a:', res);
})

const promiseB = Promise.resolve(2);
promiseB.then((res) => {
    console.log('b:', res);
});
promiseB.then((res) => {
    console.log('b:', res);
});

// 输出顺序：a:1 b:2 b:2 a:undefined