// 1.导入的{}中定义的变量
import { flag, height, num1, sum } from "./aaa.js";

if (flag) {
  console.log('小明是天才，哈哈');
  console.log(sum(20, 30));
}

// 2.直接导入export定义的变量
console.log(num1);
console.log(height);


// 3.导入export的function
import { mul, Person } from "./aaa.js";

console.log(mul(30, 30));

const p = new Person();
p.run();

//4.导入默认值
import addr from "./aaa.js";
addr('北京');

//5.统一全部导入
import * as aaa from "./aaa.js";
console.log(aaa.flag);