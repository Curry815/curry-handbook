import { initMixin } from "./init"
import { stateMixin } from "./state"
import { renderMixin } from "./render"
import { eventsMixin } from "./events"
import { lifecycleMixin } from "./lifecycle"
import { warn } from "../util/index"

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 这5个函数向Vue构造函数当作参数传给了这5个函数
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue

//例如
export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    // 做些什么
  }
}

/**
 * 数据相关的实例方法
 * 与数据相关的实例方法有3个，分别是$set、$delete、$watch，它们是在stateMixin中挂载到Vue的原型上的
*/
import {
  set,
  del
} from '../observer/index'
export function stateMixin (Vue) {
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  Vue.prototype.$watch = function (expOrFn, cb, options) {}
}
/**
 * 事件相关的实例方法
 * 与事件相关的实例方法有4个，分别是vm.$on、vm.$once、vm.$off、vm.$emit，它们是在eventsMixin中挂载到Vue的原型上的
*/
export function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {}
  Vue.prototype.$once = function (event, fn) {}
  Vue.prototype.$off = function (event, fn) {}
  Vue.prototype.$emit = function (event) {}
}
/**
 * vm.$on
 * 用法：监听当前实例上的自定义事件，事件可以由vm.$emit触发。回调函数会接收所有传入事件所触发的函数的额外参数。
 * vm._events是一个对象，用来存储事件。在代码中，我们使用事件名（event）从vm._events中取出事件列表，如果列表不存在，则使用空数组初始化，然后再将回调函数添加到列表中。vm._events是在执行new Vue()时，Vue会执行this._init方法进行一系列初始化操作，然后就会在Vue.js的实例上创建一个_events属性，用来存储事件。vm._events = Object.create(null)
*/
// 示例代码
vm.$on('test', function (msg) {
  console.log(msg);
})
vm.$emit('test', 'hi') // “hi”

Vue.prototype.$on = function (event, fn) {
  const vm = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$on(event[i], fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn)
  }
  return vm
}
/**
 * vm.$off
 *  1.如果没有提供参数，则移除所有的事件监听器
    2.如果只提供了事件，则移除该事件所有的监听器
    3.如果同时提供了事件与回调，则只移除这个回调的监听器
*/
Vue.prototype.$off = function (event, fn) {
  const vm = this
  // 1.如果没有提供参数，则移除所有的事件监听器
  // 移除所有事件的监听器
  if (!arguments.length) {
    vm._events = Object.create(null)
    return vm
  }

  // event支持数组
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$off(event[i], fn)
    }
    return vm
  }

  // 2.如果只提供了事件，则移除该事件所有的监听器
  // 如果这个事件没有被监听到，则直接退出程序
  const cbs = vm._events[event]
  if (!cbs) {
    return vm
  }
  // 移除该事件的所有监听器
  if (arguments.length === 1) {
    vm._events[event] = null
    return vm
  }

  // 3.如果同时提供了事件与回调，则只移除这个回调的监听器
  // 只移除与fn相同的监听器
  if (fn) {
    const cbs = vm._events[event]
    let cb
    let i = cbs.length
    while (i--) {  // 从后向前循环
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1) 
        break
      }
    }
  }
  return vm
}
/**
 * vm.$once
 * 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器
*/
Vue.prototype.$once = function (event, fn) {
  const vm = this
  function on () {
    vm.$off(event, on)
    fn.apply(vm, arguments)
  }
  on.fn  = fn
  vm.$on(event, on)
  return vm
}
/**
 * vm.$emit
*/
Vue.prototype.$emit = function (event) {
  const vm = this
  let cbs = vm._events[event]
  if (cbs) {
    const args = toArray(arguments, 1) //toArray把类似于数组的数据转换为真正的数组，它的第二个参数是起始位置
    for (let i = 0, l = cbs.length; i < l; i++) {
      try {
        cbs[i].apply(vm, args)
      } catch (e) {
        handleError(e, vm, `event handler for "${event}"`)
      }
    }
  }
  return vm
}
/**
 * lifecycleMixin代码如下
*/
export function lifecycleMixin (Vue) {
  Vue.prototype.$forceUpdate = function () {
    
  }
  Vue.prototype.$destroy = function () {
    
  }
}
/**
 * renderMixin代码如下
*/
export function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    
  }
}
/**
 * vm.$forceUpdate代码如下
*/
Vue.prototype.$forceUpdate = function () {
  const vm = this
  if (vm._watcher) { //vm._watcher就是vue实例的watcher，每当组件内依赖的数据发生变化，就会自动触发Vue.js实例中_watcher的update方法
    vm._watcher.update()
  }
}
/**
 * vm.$destroy代码如下
*/
Vue.prototype.$destroy = function () {
  const vm = this
  if (vm._isBeingDestroyed) {
    return
  }
  callHook(vm, 'beforeDestroy')
  vm._isBeingDestroyed = true // 标记为已被销毁
}
// 删除自己与父级之间的连接
const parent = vm.$parent
if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
  remove(parent.$children, vm)
}
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
// 从watcher监听的所有状态的依赖列表中移除watcher
if (vm._watcher) {
  vm._watcher.teardown()
}
export class Watcher {
  constructor (vm, expOrFn, cb) {
    // 每当创建watcher实例时，都将watcher实例存储在实例的_watcher属性中
    vm._watcher.push(this)
  }
}
let i = vm._watchers.length
while (i--) {
  vm._watcher[i].teardown()
}
/**
 * 销毁实例的完整代码如下
*/
Vue.prototype.$destroy = function () {
  const vm = this
  if (vm._isBeingDestroyed) {
    return
  }
  callHook(vm, 'beforeDestroy')
  vm._isBeingDestroyed = true // 标记为已被销毁

  // 删除自己与父级之间的连接
  const parent = vm.$parent
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm)
  }
  // 从watcher监听的所有状态的依赖列表中移除watcher
  if (vm._watcher) {
    vm._watcher.teardown()
  }
  let i = vm._watchers.length
  while (i--) {
    vm._watcher[i].teardown()
  }
  // 在vnode树上触发destroyed钩子函数解绑指令
  vm.__patch__(vm._vnode, null)
  // 触发destroyed钩子函数
  callHook(vm, 'destroyed')
  // 移除所有的事件监听器
  vm.$off()
}
/**
 * nextTick示例代码如下
*/
new Vue({
  methods: {
    example () {
      // 修改数据
      this.message = 'changed'
      // DOM还没有更新
      this.$nextTick(function () {
        // DOM现在更新了
        // this绑定到当前实例
        this.doSomethingElse()
      })
    }
  }
})
/**
 * nextTick方法的实现方式
 * 由于vm.$nextTick会将回调添加到任务队列中延迟执行，所以在回调执行前，如果反复调用vm.$nextTick，Vue.js并不会反复将回调添加到任务队列中，只会向任务队列中添加一个任务。此外，Vue.js内部有一个列表用来存储vm.$nextTick参数中提供的回调。在一轮事件循环中，vm.$nextTick只会向任务队列添加一个任务，多次使用vm.$nextTick会将回调添加到回调列表中缓存起来。当任务触发时，依次执行列表中的所有回调并清空列表。
*/
const callbacks = []
let pending = false // 标记是否已经向任务队列中添加一个任务，每当向任务队列中插入任务时，将pending设置为true，每当任务被执行时将pending设置为false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let microTimerFunc
let macroTimerFunc = function () {}

let useMacroTask = false

const p = Promise.resolve()
microTimerFunc = () => {
  p.then(flushCallbacks)
}

export function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res =  fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb, ctx) {
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimeFunc()
    }
  }
}

// 测试一下
nextTick(() => {
  console.log(this.name) // Berwin
}, {name: 'Berwin'})
