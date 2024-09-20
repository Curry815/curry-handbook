// 实现一个防抖函数
function handler() {
    const { value } = document.getElementById("input");
    document.getElementById('content').innerHTML = `内容：${value}`;
}
function debounce(fn, wait) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(args);
            timer = null;
        }, wait)
    };
}

document.addEventListener('input', debounce(handler, 300));

// 实现一个节流函数
function handler() {
    const { value } = document.getElementById("input");
    document.getElementById('content').innerHTML = `内容：${value}`;
}

const throttle = (fn, wait) => {
    let timer;
    return function(...args) {
        if (timer) { return; }
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, wait);
    }
}
document.addEventListener('input', throttle(handler, 300));