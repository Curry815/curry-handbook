// 实现一个私有变量，用get，set可以访问，不能直接访问
const privateName = Symbol();

class Person {
    constructor(name) {
        // 使用Symbol作为属性名
        this[privateName] = name;
    }

    // 使用get方法访问私有变量
    getName() {
        return this[privateName];
    }

    // 使用set方法修改私有变量
    setName(name) {
        this[privateName] = name;
    }
}

const person = new Person('Alice');
console.log(person.getName()); // 输出: Alice
person.setName('Bob');
console.log(person.getName()); // 输出: Bob