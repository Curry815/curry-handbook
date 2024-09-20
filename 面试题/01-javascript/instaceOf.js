function myInstanceOf(obj, constructor) {
    // 检查构造函数是否为函数
    if (typeof constructor !== 'function') {
        throw new TypeError('constructor of instanceof is not callable');
    }

    // 检查obj是否为对象或函数
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
        return false;
    }

    // 获取构造函数的原型对象
    let proto = Object.getPrototypeOf(obj);

    while(proto !== null) {
        console.log(proto, ',', constructor.prototype);
        if (proto === constructor.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return false;
}

class A {}
class B extends A {}
class C extends B {}

let obj = new C();
console.log(myInstanceOf(obj, A));