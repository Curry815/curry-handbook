// 实现sleep效果 promise
async function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    });
}

(async () => {
    await sleep(3000); // 3秒后执行
    console.log('3秒后执行');
})()


// 死循环3秒后执行
function sleep(time) {
    const startTime = Date.now();
    while (Date.now() - startTime < time) {} // 死循环3秒
}

sleep(3000);
console.log('3秒后执行');