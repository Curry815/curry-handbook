// 创建对象的几种方式
// 1. 字面量{}
const obj = {
    name: 'John',
};

// 2.构造函数
function Person(name) {
    this.name = name;
}
const person = new Person('John');

// 3.Object.create()
var person1 = Object.create(null);
person1.name = 'John';

// 4.工厂函数，返回一个新对象的函数
function createPerson(name) {
    return {
        name,
    };
}
var person2 = createPerson('John');
    
// 5.ES6 class
class Person2 {
    constructor(name) {
        this.name = name;
    }
}
var person3 = new Person2('John');  

// global.aaa = 100;
// function fn() { 
//     console.log(this.aaa);
// }
// const obj2 = { aaa: 200 }
// fn.call(obj2);