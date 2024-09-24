// 声明一个函数
function tiemo() {
    console.log('贴膜');
}

function niejiao() {
    console.log('捏脚');
}

// 暴露任意数据 常用
module.exports = {
    tiemo,
    niejiao
};

// 暴露数据
// exports.niejiao = niejiao;
// exports.tiemo = tiemo;