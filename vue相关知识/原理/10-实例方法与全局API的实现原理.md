# 第13章 实例方法与全局API的实现原理
## 13.1 数据相关的实例方法
vm.$set、vm.$delete、vm.$watch
## 13.2 事件相关的实例方法
vm.$on、vm.$once、vm.$off、vm.$emit
### 13.2.1 vm.$on
vm.$on(event, callback)
参数：
{String | Array<string>} event
{Function} callback
用法：监听当前实例上的自定义事件，事件可以由vm.$emit触发。回调函数会接收所有传入事件所触发的函数的额外参数。
### 13.2.2 vm.$off
vm.$off([event, callback])
参数：
{String | Array<string>} event
{Function} callback
用法：移除自定义事件监听器
1.如果没有提供参数，则移除所有的事件监听器
2.如果只提供了事件，则移除该事件所有的监听器
3.如果同时提供了事件与回调，则只移除这个回调的监听器
### 13.2.3 vm.$once
vm.$once(event, callback)
参数：
{String | Array<string>} event
{Function} callback
用法：
监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器
### 13.2.4 vm.$emit
vm.$emit(event, [...args])
参数：
{string} event
[...args]
用法：
触发当前实例上的事件。附件参数都会传给监听器回调。
## 13.3 生命周期相关的实例方法
与生命周期相关的实例方法有4个，分别是vm.$mount、vm.$forceUpdate、vm.$nextTick和vm.$destroy。其中有有两个方法是从lifecycleMixin中挂载到Vue构造函数的prototype属性上的，分别是vm.$forceUpdate和vm.$destroy。
vm.$nextTick方法是从renderMixin中挂载到Vue构造函数的prototype属性上的。
vm.$mount方法是在跨平台的代码中挂载到Vue构造函数的prototype属性上的。
### 13.3.1 vm.$forceUpdate
vm.$forceUpdate()的作用是迫使Vue.js实例重新渲染。注意它仅仅影响实例本身及插入插槽内容的子组件，而不是所有子组件。
我们只需要执行实例的watcher的update方法，就可以让实例重新渲染。
 vm.$forceUpdate属于手动渲染
 ### 13.3.2 vm.$destroy
 vm.$destroy()的作用是完全销毁一个实例，他会清理该实例与其他实例的连接，并解绑其全部指令及监听器，同时会触发beforeDestroy和destroy的钩子函数。
 大部分场景下不需要销毁组件，只需要使用v-if或者v-for等指令以数据驱动方式控制子组件的生命周期即可。
销毁实例的逻辑：首先清理当前组件与父组件之间的连接。组件就是Vue.js的实例，所以要清理当前组件与父组件之间的连接，只需要将当前组件实例从父组件实例的$children属性中删除即可。
说明：Vue.js实例的$children属性存储了所有子组件。
这里执行组件自身的watcher实例的teardown方法，从所有依赖项的订阅列表中的删除watcher实例。
#### 如何知道用户创建了多少个watcher？
Vue.js的解决方案是当执行new Vue()时，在初始化的流程中，在this上添加一个_watchers属性：
vm._watchers = []
然后每当创建watcher实例时，都会将watcher实例添加到vm._watchers中。通过vm._watchers就可以得到所有watcher实例我们只需要遍历vm._watchers并依次执行每一项watcher实例的teardown方法，就可以将watcher实例从它所监听的状态的依赖列表中移除。
有趣的是，当vm.$destroy执行时，Vue.js不会将已经渲染到页面中的DOM节点移除，但会将模板中的所有指令解绑。
vm.__patch__(vm._vnode, null)
接下来触发destroyed钩子函数
callHook(vm, 'destroyed')
最后移除实例上的所有事件监听器。
vm.$off()
### 13.3.3 vm.$nextTick
nextTick接收一个回调函数作为参数，它的作用是将回调延迟到下次DOM更新周期之后执行。它与全局方法Vue.nextTick一样，不同的是回调的this自动绑定到调用它的实例上。如果没有提供回调且在支持Promise的环境中，则返回一个Promise。
我们在开发项目时会遇到一种场景：当更新了状态（数据）后，需要对新DOM做一些操作，但是这时我们其实获取不到更新后的DOM，因为还没有重新渲染。这个时候我们需要使用nextTick方法。
有一个问题：下次DOM更新周期之后执行，具体是指什么时候呢？要搞清楚这个问题，需要先弄明白什么是“下次DOM更新周期”。
在Vue.js中，当状态发生变化时，watcher会得到通知，然后触发虚拟DOM的渲染流程。而watcher触发渲染这个操作并不是同步的，而是异步的。Vue.js有一个队列，每当需要渲染时，会将watcher推送到这个队列中，在下一次事件循环中再让watcher触发渲染的流程。
#### 01.为什么Vue.js使用异步更新队列？
Vue.js2.0开始使用虚拟DOM进行渲染，变化侦测的通知只发送到组件，组件内用到的所有状态的变化都会通知到同一个Watcher，然后虚拟DOM会对整个组件进行比对，并更改DOM。也就是说，如果在同一轮事件循环中有两个数据发生了变化，那么组件的watcher会收到两份通知，从而进行两次渲染。事实上，并不需要渲染两次，虚拟DOM会对整个组件进行渲染，所以只需要等所有状态都修改完毕之后，一次性将整个组件的DOM渲染到最新即可。
要解决这个问题，Vue.js的实现方式是将收到通知的watcher实例添加到队列中缓存起来，并且在添加到队列之间检查其中是否已经存在相同的watcher，只有不存在时，才将watcher实例添加到队列中，然后在下一次事件循环（event loop）中，Vue.js会让队列中的watcher触发渲染流程并清空队列。这样就可以保证即便在同一事件循环中有两个状态发生改变，watcher最后也执行一次渲染流程。
#### 02.什么是事件循环？
JavaScript是单线程且非阻塞的脚本语言，这意味着JavaScript代码在执行的任何时候都只有一个主线程来处理所有任务。而非阻塞是指当代码需要处理异步任务时，主线程会挂起（pending）这个任务，当异步任务处理完毕后，主线程再根据一定规则去执行相应的回调。
事实上，当任务处理完毕后，JavaScript会将这个事件加入一个队列中，我们称这个队列为事件队列。被放入事件队列中的事件不会立刻执行其回调，而是等待当前执行栈中的所有任务执行完毕后，主线程会去查找事件队列中是否有任务。
异步任务有两种类型：微任务和宏任务。不同类型的任务会被分配到不同的任务队列中。
当执行栈中的所有任务都执行完毕后，会去检查微任务队列中是否有事件存在，如果存在，则会依次执行微任务队列中事件对应的回调，直到为空。然后去宏任务队列中取出一个事件，把对应的回调加入当前执行栈，当执行栈中的所有任务都执行完毕后，检查微任务队列中是否事件存在。无限重复此过程，就形成了一个无限循环，这个循环就叫做事件循环。
属于微任务的事件包括但不限于以下几种：
Promise.then
MutationObserver
Object.observe
process.nextTick
属于宏任务的事件包括但不限于以下几种：
setTimeout
setInterval
setImmediate
MessageChannel
requestAnimationFrame
I/O
UI交互事件
#### 03.什么是执行栈？
当我们执行一个方法时，JavaScript会生成一个与这个方法对应的执行环境（context），又叫执行上下文。这个执行环境中有这个方法的私有作用域、上层作用域的指向、方法的参数、私有作用域中定义的变量以及this对象。这个执行环境会被添加到一个栈中，这个栈就是执行栈。
如果这个方法的代码中执行到了一行函数调用语句，那么JavaScript会生成这个函数的执行环境并将其添加到执行栈中，然后进入这个执行环境继续执行其中的代码。执行完毕并返回结果后，JavaScript会退出执行环境并把这个执行环境从栈中销毁，回到上一个方法的执行环境。这个过程反复进行，直到执行栈中的代码全部执行完毕。这个执行环境的栈就是执行栈。
回到前面的问题，“下次DOM更新周期”的意思其实是下次微任务执行时更新DOM。而vm.$nextTick其实是将回调添加到微任务中。只有在特殊情况下才会降级成宏任务，默认会添加到微任务中。
因此，如果使用vm.$nextTick来获取更新后的DOM，则需要注意顺序的问题。因为不论是更新DOM的回调还是使用vm.$nextTick注册的回调，都是向微任务队列中添加任务，所以哪个任务先添加到队列中，就先执行哪个任务。
注意：事实上，更新DOM的回调也是使用vm.$nextTick来注册到微任务中的。
如果想在vm.$nextTick中获取更新后的DOM，则一定要在更改数据的后面使用vm.$nextTick注册回调。
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
new Vue({
  methods: {
    example () {
      // 先使用nextTick注册回调
      this.$nextTick(function () {
        // DOM没有更新
      })
      // 修改数据
      this.message = 'changed'
    }
  }
})
如果是先使用vm.$nextTick注册回调，然后修改数据，则在微任务队列中先执行使用vm.$nextTick注册的回调，然后执行更新DOM的回调。所以在回调中得不到最新的DOM。因此此时DOM还没有更新。
所以，在事件循环中，必须当微任务队列中的事件都执行完毕之后，才会从宏任务队列中取出一个事件执行下一轮，所以添加到微任务队列中的任务的执行时机优先于向宏任务队列中添加的任务。

修改数据会默认将更新DOM的回调添加到微任务队列中。
new Vue({
  methods: {
    example () {
      // 先使用setTimeout向宏任务中注册回调
      setTimeout(_ => {
        // DOM现在更新了
      }, 0)
      // 然后修改数据向微任务中注册回调
      this.message = 'changed'
    }
  }
})
setTimeout属于宏任务，使用它注册的回调会加入到宏任务中。宏任务的执行要比微任务晚，所以即便是先注册，也是先更新DOM后执行setTimeout中设置的回调。
vm.$nextTick和全局方法Vue.nextTick是相同的，所以nextTick的具体实现并不是在Vue原型上的$nextTick方法中，而是抽象成了nextTick方法供两个方法共用。
import { nextTick } from '../util/index'
Vue.prototype.$nextTick = function (fn) {
  return nextTick(fn, this)
}
可以看到，Vue原型上的$nextTick方法只是调用了nextTick方法，具体实现其实在nextTick中。
说明：更新DOM的回调也是使用nextTick将任务添加到任务队列中。
被withMacroTask包裹的函数所使用的所有vm.$nextTick方法都会将回调添加到宏任务队列中，其中包括状态被修改后触发的更新DOM的回调和用户自己使用vm.$nextTick注册的回调等。
microTimerFunc的实现原理是使用Promise.then，但不是所有浏览器都支持Promise,当不支持时，会降级成macroTimerFunc。
如果没有提供回调且在支持Promise的环境中，则返回一个Promise。
this.$nextTick()
  .then(function () {
    // DOM更新了
  })
### 13.3.4 vm.$mount
vm.$mount([elementOrSelector])
渲染只渲染一次，挂载指的是持续性渲染。挂在之后，每当状态发生变化时，都会进行渲染操作。
## 13.4 全局API的实现原理
### 13.4.1 Vue.extend
Vue.extend(options)
参数：{Object} options
用法：使用基础Vue构造器创建一个“子类”，其参数是一个包含“组件选项”的对象。
data选项是特例，在Vue.extend()中，它必须是函数：
全局API和实例方法不同，后者是在Vue的原型上挂载方法，也就是在Vue.prototype上挂载方法，而前者是直接在Vue上挂载方法。
Vue.extend = function (extendOptions) {
  // 做点什么
}
Vue.extend的作用是创建一个子类，然后让它继承Vue身上的一些功能。
### 13.4.2 Vue.nextTick
Vue.nextTick([callback, context])
参数：
{Function} [callback]
{Object} [context]
用法：在下次DOM更新循环结束之后执行延迟回调，修改数据之后立即使用这个方法获取更新后的DOM。
示例：
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
注意：Vue.nextTick的实现原理与vm.$nextTick一样。
Vue.nextTick = nextTick
### 13.4.3 Vue.set
Vue.set(target, key, value)
参数：
{Object | Array} target
{String | number} key
{any} value
返回值：设置的值
用法：设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的。同时触发视图更新。这个方法主要用于避免Vue不能检测属性被添加的限制。
注意：Vue.set与vm.$set的实现原理一样
Vue.set = set
### 13.4.4 Vue.delete
Vue.delete(target, key)
参数：
{Object | Array} target
{String | number} key/index
用法：删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开Vue.js不能检测到属性被删除的限制。
注意：Vue.delete的实现原理与vm.$delete一样。
Vue.delete = del
### 13.4.5 directive
Vue.directive(id, [definition])
参数：
{string} id
{Function | Object} [definition]
用法：注册或获取全局指令
### 13.4.6 Vue.filter
Vue.filter(id, [definition])
参数：
{string} id
{Function | Object} [definition]
用法：注册或获取全局过滤器
Vue.js允许自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和v-bind表达式。过滤器应该被添加在JavaScript表达式的尾部，由"管道"符号指示。
{{message | capitalize}}
<div v-bind:id="rawId | formatId"></div>

### 13.4.7 Vue.component
Vue.component(id, [definition])
参数：
{string} id
{Function | Object} [definition]
用法：注册或获取全局组件。
### 13.4.8 Vue.use
Vue.use(plugin)
参数：
{Object | Fuction} plugin
用法：安装Vue.js插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法，会将Vue作为参数传入。install方法被同一个插件多次调用时，插件也只会被安装一次。
### 13.4.9 Vue.mixin
Vue.mixin(mixin)
参数：
{Object} mixin
用法：全局注册一个混入（mixin），影响注册之后创建的每个Vue.js实例。因为mixin方法修改了Vue.options属性，而之后创建的每个实例都会用到该属性，所以会影响创建的每个实例。插件作者可以使用混入向组件注入自定义行为（例如：监听生命周期钩子）。不推荐在应用代码中使用。
### 13.4.10 Vue.compile
Vue.compile(template)
参数：
{string} template
用法：编译模板字符串并返回包含渲染函数的对象。只在完整版中才有效。
Vue.compile方法只需要调用编译器就可以实现功能，compileToFunctions方法可以将模板编译成渲染函数
Vue.compile = compileToFunctions
### 13.4.11 Vue.version
Vue.version是一个属性。在构建文件的配置中定义了__VERSION__常量
## 13.5 总结
本章中，我们详细介绍了Vue.js的实例方法和全局API的实现原理。它们的区别在于：实例方法是Vue.prototype上的方法，而全局API是Vue.js上的方法。
实例方法又分为数据、事件和声明周期这三个类型。
同时还扩展了知识，例如Vue.$nextTick时，JavaScript事件循环机制，以及微任务和宏任务之间的区别等。