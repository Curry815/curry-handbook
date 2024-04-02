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
import { isNative, isPlainObject, noop } from "lodash"
import { promise } from "nice-try"
import { func } from "assert-plus"
import { type } from "os"
import { resolve } from "path"
import { option } from "commander"
import { types } from "util"
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

/**
 * macroTimerFunc是如何将回调添加到宏任务队列中？
 * vue.js优先使用setImmediate，然后是MessageChanel，最后是setTimeout
*/
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
if (typeof Promise !== 'undefined' && isNative(promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  microTimerFunc = macroTimerFunc
}
/**
 * 如果没有提供回调且在支持Promise的环境中，则返回一个Promise。
*/
this.$nextTick()
  .then(function () {
    // DOM更新了
  })
/**
 * 要实现这个功能，我们只需要在nextTick中进行判断，如果没有提供回调且当前环境Promise,那么返回Promise，并且在callbacks中添加一个函数，当这个函数执行时，执行Promise的resolve即可
*/
export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
/**
 * 完整代码如下
*/
const callbacks = []
let pending = false
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0, l = copies.length; i++) {
    copies[i]()
  }
}
let microTimerFunc
let macroTimerFunc
let useMacroTask = false
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () =>{
    setTimeout(flushCallbacks, 0)
  }
}
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  microTimerFunc = macroTimerFunc
}
export function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}
export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
/**
 *mountComponent函数将Vue.js实例挂载到DOM元素上
*/
export function mountComponent (vm, el) {
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      // 在开发环境下发出警告
    }
  }
  // 触发生命周期钩子
  callHook(vm, 'beforeMount')

  // 挂载
  vm._watcher = new Watcher(vm, () => {
    vm._update(vm._render()) // 先调用渲染函数得到一份最新的VNode节点数，然后通过_update方法对最新的VNode和上一次渲染用到的旧VNode进行比对并更新DOM节点。简单来说，就是执行了渲染操作。
  }, noop)

  // 触发生命周期钩子
  callHook(vm, 'mounted')
  return vm
}
/**
 * Vue.extend
*/
<div id="mount-point"></div>
// 创建构造器
var Profile = Vue.extend({
  template: `<p>{{firstName}} {{lastName}} aka {{alias}}</p>`,
  data: function() {
    return {
      firstName: 'walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建Profile实例，并挂载到一个元素上
new Profile().$mount('mount-point')
/**
 * Vue.extend完整代码如下
 * 创建了一个Sub函数并继承了父级，如果直接使用Vue.extend,则Sub继承于Vue构造函数
*/
let cid = 1
Vue.extend = function (extendOptions) {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }
  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production') {
    if (!/^[a-zA-Z][\w-]*$/.test(name)) {
      warn(
        'Invalid component name: "' + name + '", Component names ' + 'can only contain alphanuberric characters and the hyphen, ' + 
        'and must start with a letter.'
      )  
    }
  }
  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++

  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super
  
  if (Sub.options.props) {
    initProps(Sub)
  }

  if (Sub.options.computed) {
    initComputed(Sub)
  }

  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  //ASSET_TYPES = ['component', 'directive', 'filter']
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })

  if (name) {
    Sub.options.components[name] = Sub
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // 缓存构造函数
  cachedCtors[SuperId] = Sub
  return Sub
}
/**
 * Vue.nextTick示例
*/
// 修改数据
vm.msg = 'Hello'
// DOM还没有更新
Vue.nextTick(function () {
  // DOM更新了
})
// 作为一个Promise使用（这是2.1.0新增的）
Vue.nextTick()
  .then(function () {
    // DOM更新了
  })
/**
 * Vue.directive方法的作用是注册或获取全局指令，而不是让指令生效。
 * 其区别就是注册指令需要做的事是将指令保存在某个位置，而让指令生效是将指令从某个位置拿出来执行它
*/
// 注册
Vue.directive('my-directive', {
  bind: function () {},
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
})

// 注册（指令函数）
Vue.directive('my-directive', function () {
  // 这里将会被bind和update调用
})

// getter方法，返回已注册的指令
var myDirective = Vue.directive('my-directive')

/**
 * 注册指令的实现代码如下
*/
Vue.options = Object.create(null)
Vue.options['directive'] = Object.create(null)

Vue.directive = function (id, definition) {
  if (!definition) {
    return this.options['directive'][id]
  } else { // 注册操作
    if (typeof definition === 'function') {
      definition = {bind:definition, update: definition}
    }
    this.options['directive'][id] = definition
    return definition
  }
}
/**
 * Vue.filter
*/
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})
//getter方法，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')

/**
 * 注册过滤器的实现代码如下
*/
Vue.options = Object.create(null)
Vue.options['filters'] = Object.create(null)

Vue.filter = function (id, definition) {
  if (!definition) {
    return this.options['filters'][id]
  } else { // 注册操作
    this.options['filters'][id] = definition
    return definition
  }
}
/**
 * 注册全局组件的实现代码如下
*/
Vue.options = Object.create(null)
Vue.options['components'] = Object.create(null)

Vue.component = function (id, definition) {
  if (!definition) {
    return this.options['components'][id]
  } else { // 注册操作
    if (isPlainObject(definition)) {
      definition.name = definition.name || id
      definition = Vue.extend(definition) // 组件其实一个构造器
    }
    this.options['components'][id] = definition
    return definition
  }
}
Vue.options = Object.create(null)
// ASSET_TYPES = ['components', 'directives', 'filters']
ASSET_TYPES.forEach(type => {
  Vue.options[type + 's'] = Object.create(null)
})
ASSET_TYPES.forEach(type => {
  Vue[type] = function (id, definition) {
    if (!definition) {
      return this.options[type + 's'][id]
    } else {
      if (type === 'component' && isPlainObject(definition)) {
        definition.name = definition.name || id
        definition = Vue.extend(definition)
      }
      if (type === 'directive' && typeof definition === 'function') {
        definition = {bind: definition, update: definition}
      }
      this.options[type + 's'][id] = definition
      return definition
    }

  }
})
/**
 * Vue.use
*/
Vue.use = function (plugin) {
  const installPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installPlugins.indexOf(plugin) > -1) { // 判断是否已经被注册过
    return this
  }
  // 其他参数
  const args = toArray(arguments, 1)
  args.unshift(this) // 使用unshift方法确保参数第一个是Vue,其余参数是注册插件时传入的参数
  if (typeof plugin.install === 'function') { // plugin参数支持对象类型
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') { // plugin参数支持函数类型
    plugin.apply(null, args)
  }
  installPlugins.push(plugin)
  return this
}
/**
 * Vue.mixin
*/
// 为自定义的选项myOption注入一个处理器
Vue.mixin({
  create: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption);
    }
  }
})
new Vue({
  myOption: 'hello'
})
// => "hello"
export function initMixin (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
/**
 * Vue.compile
*/
var res = Vue.compile('<div><span>{{msg}}</span></div>')
new Vue({
  data: {
    msg: 'hello'
  },
  render: res.render
})