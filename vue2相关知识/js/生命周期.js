import { ifError } from "assert"
import { config } from "bluebird"
import { name } from "commander"
import { warn } from "console"
import { VM } from "handlebars"
import { isObject, isPlainObject } from "lodash"
import { observable } from "rxjs"

export function Vue (options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
initMixin(Vue)

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    // 做些什么
  }
}
/**
 * _init方法的内部原理
*/
Vue.prototype._init = function (options) {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // 在data/props前初始化inject
  initState(vm)
  initProvide(vm) // 在data/props后初始化provide
  callHook(vm, 'created')
  //如果用户在实例化Vue.js时传递了el选项，则自动开启模板编译阶段与挂载阶段
  // 如果没有传递el选项，则不进入下一个生命周期流程
  // 用户需要执行vm.$mount方法，手动开启模板编译阶段与挂载阶段
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
/**
 * callHook函数的内部原理
 * handleError会依次执行父组件的errorCaptured钩子函数与全局的config.errorHandler，这也是为什么生命周期钩子errorCaptured可以捕获子孙组件的错误。
*/
export function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
}
/**
 * 错误的传播规则是在handerError函数中实现
*/
export function handleError (err, vm, info) {
  if (vm) {
    let cur = vm
    while ((cur = cur.$parent)) { // 自底向上寻找根组件
      const hooks = cur.$options.errorCaptured
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) return         
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info)
}
function globalHandleError (err, vm, info) {
  // 这里的config.errorHandler就是Vue.config.errorHandler
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e)
    }
  }
  logError(err)
}
function logError (err) {
  console.log(err);
}
/**
 * initLiftcycle
*/
export function initLiftcycle (vm) {
  const options = vm.$options
  
  // 找出第一个非抽象父类
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm // 自顶向下将根组件的$root依次传递给每一个子组件的过程。
  vm.$children = []
  vm.$refs = {}
  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
/**
 * 初始化事件
*/
export function initEvents (vm) {
  vm._events = Object.create(null)
  // 初始化父组件附加的事件
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
/**
 * vm.$options._parentListeners
*/
{
  increment: function () {}
}
/**
 * updateComponentListeners函数的实现
*/
let target
function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}

function remove (event, fn) {
  target.$off(event, fn)
}

export function updateComponentListeners (vm, listeners, oldListeners) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, vm)
  target = undefined
}
/**
 * updateListeners函数的实现
*/
export function updateListeners (on, oldOn, add, remove, vm) {
  let name, cur, old, event
  // 在循环on的过程中，有如下三个判断
  for (name in on) {
    cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event}": got null`,
        vm
      )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm)
      }
      add(event.name, cur, event.once, event.capture, event.passive)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
/**
 * normalizeEvent函数的作用是将事件修饰符解析出来
*/
const normalizeEvent = name => {
  const passive = name.chartAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.chartAt(0) === '~'
  name = once ? name.slice(1) : name
  const capture = name.chartAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name,
    once,
    capture,
    passive
  }
}
/**
 * provide/inject示例
*/
var Provider = {
  provide: {
    foo: 'bar'
  },

}
var child = {
  inject = ['foo'],
  created () {
    console.log(this.foo); // bar
  }
}
/**
 * 如果使用Symbol作为key
*/
const s = Symbol()
const Provider = {
  provide () {
    return {
      [s]: 'foo'
    }
  }
}
const Child = {
  inject: { s }, 
}
//并且可以在data/props中访问注入的值。例如，使用一个注入的值作为props的默认值
const Child = {
  inject: ['foo'],
  // 或在2.5版本以上，可以设置inject的默认值使其变成可选项
  inject: {
    foo: {default: 'foo'},
    // 如果它需要从一个不同名字的属性注入，则使用from来表示其源属性
    foo: {
      from: 'bar',
      default: 'foo',
      // 对于非原始值使用一个工厂方法
      default: () => [1, 2, 3]
    }
  },
  props: {
    bar: {
      default () {
        return this.foo
      }
    }
  },
  // 或者使用一个注入的值作为数据入口
  data () {
    return {
      bar: this.foo
    }
  }
} 
/**
 * 初始化inject的方法叫做initInjections
*/
export function initInjections (vm) {
  const result = resolveInject(vm.$options.inject, vm) // 自底向上获取内容
  if (result) {
    ObserverState.shouldConvert = false // 阻止defineReactive函数不要将内容转换成响应式
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key]);
    })
    ObserverState.shouldConvert = true
  }
}
/**
 * resolveInject函数的实现
*/
export function resolveInject (inject, vm) {
  if (inject) {
    const result = Object.create(null)
    // 做些什么
    const keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(key => {
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      if (!source) {
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          result[key] = isFunction(provideDefault)
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
/**
 * 规格化props的实现
*/
function normalizeProps(options, vm) {
  const props = options._props
  if (!props) {
    return
  }
  const res = {}
  let i, val, name
  if (isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val) ? val : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(`Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`, vm)
  }
  options._props = res
} 
/**
 * 初始化props方法叫做initProps
*/
function initProps (vm, propsOptions) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // 缓存props的key
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root实例的props属性应该被转换成响应式数据
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    defineReactive(props, key, value)
    if (!(key in vm)) {
      proxy(vm, '_props', key)
    }
  }
  toggleObserving(true)
}
/**
 * validateProp函数如何获取props内容
 * validateProp函数接收如下4个参数：
  key: propOptions中的属性名
  propOptions：子组件用户设置的props选项
  propsData：父组件或用户提供的props数据
  vm：Vue.js实例上下文，this的别名
  函数中先声明3个变量prop、absent、value
  变量prop保存的内容是当前这个key的prop选项，变量absent表示当前的key在用户提供的props选项中是否存在，变量value表示使用当前这个key在用户提供的props选项中获取的数据。也就是说，这3个变量分别保存当前这个key的prop选项、prop数据以及一个布尔值（用来判断prop数据是否存在）。事实上，变量value中可能存在正确的值，也有可能不存在。
*/
export function validateProp (key, propOptions, propsData, vm) {
  const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  const value = propsData[key]
  // 处理布尔类型的props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) { // 不存在且没有默认值
      value = false
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) { // 存在且默认值是字符串，或者存在且默认值是驼峰命名或者value和key相等
      value = true
    }
  }
  // 检查默认值
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // 因为默认值是新的数据，所以需要转换成响应式
    const prevShouldConvert = observerState.shouldConvert
    observerState.shouldConvert = true
    observe(value)
    observerState.shouldConvert = prevShouldConvert
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}
/**
 * initMethods方法实现
 * 1.校验方法是否合法
 * 2.将方法挂载到vm实例上
*/
function initMethods (vm, methods) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) { // 只有key没有value就发出警告
        warn(`Method "${key}" has an undefined value in the component definition.`, vm)
      }
    if (props && hasOwn(props, key)) { // methods中某个方法已经存在于vm中
      warn(`Method "${key}" has already been defined as a prop.`, vm)
    }
    if ((key in vm) && isReserved(key)) {// isReserved判断方法名是否以$或_开头
      warn(`Method "${key}" conflicts with an existing Vue instance method.` + `Avoid defining component methods that start with _ or $.`, vm)
    }
  }
  // 2.将方法挂载到vm中
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}
/**
 * initData方法实现
 * proxy函数实现代理功能，该函数的作用是在第一个参数上设置一个属性名为第三个参数的属性。这个属性的修改和获取操作实际上针对的是与第二个参数相同属性名的属性。
*/
function initData (vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm)
  }
  // 将data代理到Vue.js实例上
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = key[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(`Method "${key}" has already been defined as a data property.`, vm)
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(`The data property "${key}" is already declared as a prop. ` + `Use prop default value instead.`, vm)
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // 观察数据
  observe(data, true /* asRootData */)
}
/**
 * proxy代码实现
 * sharedPropertyDefinition是默认属性描述符
*/
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/**
 * 计算属性的具体实现
*/
const computedWatcherOptions = { lazy: true }
function initComputed (vm, computed) {
  const watchers = vm._computedWatchers = Object.create(null)
  // 计算属性在SSR环境中，只是一个普通的getter方法
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm)
    }

    // 在非SSR环境中，为计算属性创建内部观察器
    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
/**
 * defineComputed方法实现
 * 计算属性的缓存与响应式功能主要在于是否将getter方法设置为createComputedGetter函数执行后的返回结果
*/
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function defineComputed (target, key, userDef) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') { // 计算属性支持函数和对象
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key) //计算属性的getter方法
      : userDef // 普通的getter方法，没有响应式功能
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : userDef.get
        : noop
    sharedPropertyDefinition.set = userDef.set
        ? userDef.set
        : noop
  }
  if (process.env.NODE_ENV !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
    
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/**
 * createComputedGetter函数实现缓存以及响应式功能
*/
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
/**
 * Watcher 中的evaluate和depend方法实现
*/
export class Watcher {
  constructor (vm, expOrFn, cb, options) {
    // 隐藏无关代码

    if (options) {
      this.lazy = !!options.lazy
    } else {
      this.lazy = false
    }

    this.dirty = this.lazy

    this.value = this.lazy ? undefined : this.get()
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  depend () {
    let i = this.deps.length //this.deps保存了计算属性用到的所有状态的dep实例，而每个属性的dep实例中保存了它的所有依赖,并依次执行dep实例的depend方法
    while (i--) {
      this.deps[i].depend()
    }
  }
}
/**
 * 新版的createComputedGetter函数实现缓存以及响应式功能
*/
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      watcher.depend()
      return watcher.evaluate()
    }
  }
}
/**
 * 新版的Watcher的代码实现
*/
export class Watcher {
  constructor (vm, expOrFn, cb, options) {
    // 隐藏无关代码

    if (options) {
      this.computed = !!options.computed
    } else {
      this.computed = false
    }

    this.dirty = this.computed

    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  update () {
    if (this.computed) {
      if (this.dep.subs.length === 0) {
        this.dirty = true // lazy
      } else {
        this.getAndInvoke(() => { // activated
          this.dep.notify()
        })
      }
    }
    // 隐藏无关代码
  }

  getAndInvoke (cb) {
    const value = this.get()
    if (value !== this.value || isObject(value) || this.deep) {
      const oldValue = this.value
      this.value = value
      this.dirty = false
      if (this.user) {
        try {
          cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(e, this.vm, `getter for watcher "${this.expression}"`)
        }
      } else {
        cb.call(this.vm, value, oldValue)
      }
    }
  }
  evaluate () {
    if (this.dirty) {
      this.value = this.get()
      this.dirty = false
    }
    return this.value
  }

  depend () {
   if (this.dep && Dep.target) {
    this.dep.depend()
   } 
  }
}
/**
 * initWatch函数实现
*/
function initWatch (vm, watch) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
/**
 * createWatcher函数主要负责处理其他类型的handler并调用vm.$watch创建Watcher观察表达式
 * vm: Vue.js实例上下文（this）
 * expOrFn: 表达式或者计算属性函数
 * handler: watch对象的值
 * options：用于传递给vm.$watch的选项对象
*/
function createWatcher (vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
/**
 *  initProvide函数实现
*/
export function initProvide (vm) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}