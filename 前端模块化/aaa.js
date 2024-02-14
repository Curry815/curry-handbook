var name = '小明';
var age = 18;
var flag = true;

function sum(num1, num2) {
  return num1 + num2;
}

if (flag) {
  console.log(sum(20, 30));
}

// 1.导出方式一：
export {
  flag,
  sum
}

// 2.导出方式二：
export var num1 = 1000;
export var height = 1.88;


// 3.导出函数/类
export function mul(num1, num2) {
  return num1 * num2
}

export class Person {
  run(){
    console.log('奔跑');
  }
}

// 4.导出默认值  export default不允许同时存在多个
export default function (argument) {
  console.log(argument);
}
