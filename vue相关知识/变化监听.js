import { calculateDSAPublic } from "sshpk"

// Object.defineProperty() 方法是 JavaScript 中用于定义对象属性的方法。它允许您精确地控制属性的行为，包括属性的可枚举性、可配置性、可写性以及获取和设置属性值时的行为。
const { log } = require("console")
// 虽然 Object.defineProperty() 本身并不能直接监听对象的变化，但是您可以使用它来定义 getter 和 setter 方法，从而实现对属性的监听。下面是一个示例，展示了如何使用 Object.defineProperty() 来监听对象属性的变化：
// 1.创建对象
const obj = {
  _value: 'zhangsan', 
}
// 2.定义 getter 和 setter
Object.defineProperty(obj, 'value', {
  get() {
    console.log('get value')
    return this._value
  },
  set(value) {
    console.log('set value')
    this._value = value
  }
})
// 3.访问属性
console.log(obj.value) // get value, zhangsan
// 4.设置属性
obj.value = 'lisi'
console.log(obj.value) // set value, lisi


/**
 * 这里的代码演示了如何封装 Object.defineProperty() 来监听对象属性的变化，同时也展示了如何在对象上定义 getter 和 setter 方法。defineReactive的作用就是定义一个响应式数据，它可以监听对象的属性变化，并在变化时执行相应的操作。只需要传data，key和val参数即可。
 */
function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
    }
  })
}

/**
 * 依赖收集
 *  首先每个key都有一个数组，用来储存当前key的依赖。假设依赖是一个函数，保存在window.target上，把defineReactive函数改造一下。
 */
function defineReactive (data, key, val) {
  let dep = [] // 收集依赖
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.push(window.target) // 新增
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      // 新增
      for (let i = 0; i < dep.length; i++) {
        dep[i](newVal, val)
      }
      val = newVal
    }
  })
}
/**
 * 依赖收集
 *  封装成Dep类，每个key都有一个Dep类，用来收集依赖、删除依赖或者向依赖发送通知等。
 */
// export default class Dep {
export class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (window.target) {
      this.addSub(window.target)
    }
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
function defineReactive(data, key, val) {
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend() // 修改
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify() // 新增
    }
  })
}

/**
 * 实现Watcher功能：
 * 这段代码可以把自己主动添加到data.a.b.c的Dep中，因为在get方法中先把window.target设置成了this,也就是当前Watcher实例，然后再读一下data.a.b.c的值，这肯定会触发getter。触发了getter,就会触发收集依赖的逻辑，而关于收集依赖，会从window.target中读取一个依赖并添加到Dep类中，这就导致，只要先在window.target赋一个this，然后再读一下值，去触发getter，就可以把this主动添加到keypath的Dep中了。依赖注入到Dep中后，每当data.a.b.c的值发生变化时，就会让依赖列表中所有的依赖循环触发update方法，也就是Watcher中的update方法，而update方法会执行参数中的回调函数，将value和oldValue传到参数中。所以不管是用户执行的v,.$watch('a.b.c', (value, oldValue) => {})， 还是模板中用到的data，都是通过Watcher来通知自己是否需要发生变化。
*/
// export default class Watcher {
export class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    // 执行this.getter()，就可以获取data.a.b.c的内容
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}

/**
 * parsePath解析简单路径
 * parsePath读取字符串keypath
*/
const bailRE = /[^\w.$]/
export function parsePath(path) {
  if (conditionRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
    
  }
}
/**
 * Observer类会附加到每一个被侦测的object上。
 * 一旦被附加上，observer会将obejct的所有属性转换为getter/setter的形式
 * 来收集属性的依赖，并且当属性发生变化时，会通知这些依赖
 * 定义一个Observer类，它能把一个正常的object转换成被侦测的object，然后判断数据的类型，只有Object类的数据才会调用walk将每一个属性转换成getter/setter的形式来z侦测变化。最后，在defineReactive中新增new Observer(val)来递归子属性，这样我们就可以把data中的所有属性都转换成getter/setter的形式来侦测变化。当data中的某个属性发生变化时，这个属性对应的依赖就会接受到通知，也就是说，只要我们将一个object传到Observer中，那么这个object就会变成响应式的object。
*/
export class Observer {
  constructor(value) {
    this.value = value

    if (!Array.isArray(value)) {
      this.walk(value)
    }
  }

  /**
   * walk会遍历对象的所有属性，把它们转换为getter/setter的形式来侦测变化
   * 这个方法只有在数据类型为Object时被调用
  */
 walk (obj) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
 }
}

function defineReactive(data, key, val) {
  // 新增，递归子属性
  if (typeof val === 'object') {
    new Observer(val)
  }

  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend()
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}
/**
 * vue追踪不到属性的变化：添加/删除的情况
*/
var vm = new Vue({
  el: '#el',
  template: '#demo-template',
  methods: {
    action() {
      this.obj.name = 'berwin'
    }
  },
  data: {
    obj: {}
  }
})
var vm = new Vue({
  el: '#el',
  template: '#demo-template',
  methods: {
    action() {
      delete this.obj.name
    }
  },
  data: {
    obj: {
      name: 'berwin'
    }
  }
})
/**
 * 拦截器
*/
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      return original.apply(this, args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
export class Observer {
  constructor(value) {
    this.value = value

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods // 新增，这里的作用是将拦截器（加工后具备拦截功能的arrayMethods）赋值给value.__proto__，通过__proto__实现覆盖value原型的功能
    } else {
      this.walk(value)
    }
  }
}
/**
 * 将拦截器方法挂载到数组的属性上
*/
import { arrayMethods } from './array'
import { isObject, keys } from "lodash"
import { object } from "assert-plus"
import cons from "consolidate"

// __proto__是否可用
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor(value) {
    this.value = value

    if(Array.isArray(value)) {
      // 修改
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }
  // ...
}
function protoAugment (target, src, keys) {
  target.__proto__ = src
}
function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
/**
 * Array的依赖和Object一样，也在defineReactive中收集
*/
function defineReactive(data, key, val) {
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend()
      // 这里收集Array的依赖
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      dep.notify()
      val = newVal
    }
  })
}
export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep() // 新增dep

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }
}
/**
 * Array收集依赖
*/
function defineReactive (data, key, val) {
  let childOb = observe(val) // 修改
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend()

      //新增
      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      dep.notify()
      val = newVal
    }
  })
}
/**
 * 数组收集依赖
 * 尝试为value创建一个Observer实例，
 * 如果创建成功，直接返回新创建的Observer实例
 * 如果value已经存在一个Observer实例，则直接返回这个实例
*/
export function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}
/**
 * 在拦截器中获取Observer实例
 * 
*/
// 工具函数
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this) // 新增了一个不可枚举的属性__ob__，这个属性就是当前Observer的实例，然后就可以拿到__ob__上的dep

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }
}

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value: function mutator (...args) {
      const ob = this.__ob__ // 新增 通过this.__ob__来获取Observer实例
      return original.apply(this, args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
});

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    ob.dep.notify() // 向依赖发送消息
    return result
  })
})

/**
 * 在Observer中将Array转换成响应式
*/
export class Observer {
  constructor (value) {
    this.value = value
    def(value, '__ob__', this)

    // 新增
    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * 侦测Array中的每一项
  */
 observeArray (items) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i]) // 每个元素都执行了一遍new Observer
  }
 }
}

/**
 * 侦测新增元素的变化
 * 1.获取新增元素
*/
;['push', 'pop', 'shift', 'unshift', 'splice'].forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    ob.dep.notify()
    return result
  })
})
/**
 * 2.使用Observer侦测新增元素
*/
;['push', 'pop', 'shift', 'unshift', 'splice'].forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted) // 新增，如果有新增的元素，则使用ob.observeArray来侦测这些新增元素的变化
    ob.dep.notify()
    return result
  })
})

/**
 * 监听数组的变动应该怎么实现？
 * 1.使用 Proxy 对象
 * 2.使用观察者模式
*/
// 1.使用 Proxy 对象
let array = [1, 2, 3]
let handler = {
  set(target, property, value) {
    console.log(`${property} changed from ${target[property]} to ${value}`);
    target[property] = value;
    return true;
  }
}
let proxy = new Proxy(array, handler)
proxy[0] = 10; // 输出: "0 changed from 1 to 10"

// 2.使用观察者模式
class ObservableArray {
  constructor(arr) {
      this.arr = arr;
      this.observers = [];
  }
  addObserver(observer) {
      this.observers.push(observer);
  }
  notifyObservers(index, value) {
      this.observers.forEach(observer => observer.update(index, value));
  }
  set(index, value) {
      this.arr[index] = value;
      this.notifyObservers(index, value);
  }
}
let arr1 = new ObservableArray([1, 2, 3]);
arr1.addObserver({
  update(index, value) {
      console.log(`${index} changed to ${value}`);
  }
});
arr1.set(0, 10); // 输出: "0 changed to 10"

/**
 * vm.$watch的实现
*/
Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this
  options = options || {}
  const watcher = new Watcher(vm, expOrFn, cb, options) // expOrFn可以是一个函数
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}
export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    // expOrFn参数支持函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
  }
}
export  class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    this.deps = [] // 新增
    this.depIds = new Set() // 新增
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  addDep (dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id) // 记录当前Watcher已经订阅了这个Dep
      this.deps.push(dep) // 记录自己都订阅了哪些Dep
      dep.addSub(this) // 最后将自己订阅到Dep中
    }
  }
}
/**
 * 在Watcher中新增addDep方法后，Dep中收集依赖的逻辑也需要有所改变
*/
let uid = 0 // 新增
export class Dep {
  constructor () {
    this.id = uid++ // 新增
    this.subs = [] 
  }

  depend () {
    if (window.target) {
      window.target.addDep(this) // 新增
    }
  }

  removeSub (sub) {
    const index = this.subs.indexOf(sub)
    if (index > -1) {
      return this.subs.splice(index, 1)
    }
  }
}
/**
 * 从所有依赖项的Dep列表中将自己移除
*/
teardow () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].removeSub(this)
  }
}
/**
 * deep参数的实现原理
*/
export class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    
    // 新增
    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }

    this.deps = []
    this.depIds = new Set()
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(vm, vm)
    // 新增
    if (this.deep) {
      traverse(value)
    }
    window.target = undefined
    return value
  }
}
/**
 * 递归value的所有子值来触发它们收集依赖的功能
*/
const seenObjects = new Set()
export function traverse (val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}
function _traverse (val, seen) {
  let i, key
  const isA = Array.isArray(val)
  if (!isA && !isObject(val) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i  = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while(i--) _traverse(val[keys[i]], seen) //如果是Object类型的数据，则循环Object中的所有key，然后执行一次读取操作，再递归子值
  }
}