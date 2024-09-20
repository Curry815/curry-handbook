// 累加
const result = [1,2,3].reduce((prev, cur) => prev + cur, 0);
console.log('result: ', result);

// 找最大值
const result2 = [1,2,3,2,1].reduce((pre, cur) => Math.max(pre, cur));
console.log('result2: ', result2);

// 数组去重
const result3 = [1,2,3,2,1].reduce((preList, cur) => preList.indexOf(cur) === -1 ? [...preList, cur] : preList, []);
console.log('result3: ', result3);

// 归类
const dataList = [{
    name: 'a',
    country: 'China'
}, {
    name: 'b',
    country: 'USA'
}, {
    name: 'c',
    country: 'China'
}, {
    name: 'd',
    country: 'USA'
}, {
    name: 'e',
    country: 'EN'
}];

const resultObj = dataList.reduce((preObj, cur) => {
    const { country } = cur;
    if (!preObj[country]) {
        preObj[country] = [];
    }
    preObj[country].push(cur);
    return preObj;
}, {});
console.log('resultObj', resultObj);

// 字符串反转
const str = 'hello world';
const resultStr = Array.from(str).reduce((pre, cur) => {
    return `${cur}${pre}`;
}, '');
console.log('resultStr', resultStr);
