// 数组去重
const arr = [1,2,2,3,4,4,5];
const uniqueArr = [...new Set(arr)];
console.log('uniqueArr', uniqueArr);

const arr2 = [1,2,2,3,4,4,5];
const uniqueArr2 = arr2.filter((value, index, self) => self.indexOf(value) === index);
console.log('uniqueArr2', uniqueArr2);

const arr3 = [1,2,2,3,4,4,5];
const uniqueArr3 = arr3.reduce((acc, cur) => acc.includes(cur) ? acc : [...acc, cur], []);
console.log('uniqueArr3', uniqueArr3);

const arr4 = [1,2,2,3,4,4,5];
const uniqueArr4 = [];
arr4.forEach((value) => {
    if (!uniqueArr4.includes(value)) {
        uniqueArr4.push(value);
    }
});
console.log('uniqueArr4', uniqueArr4);

const arr5 = [1,2,2,3,4,4,5];
const uniqueArr5 = [];
arr5.forEach((value) => {
    if (uniqueArr5.indexOf(value) === -1) {
        uniqueArr5.push(value);
    }
});
console.log('uniqueArr5', uniqueArr5);
