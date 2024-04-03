const { isUndefined, remove } = require("lodash");
const { normalize } = require("path");

/**
 * updateDOMListeners函数实现
*/
let target
function updateDOMListeners (oldVnode, vnode) {
  if (isUndefined(oldVnode.data.on) && isUndefined(vnode.data.on)) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  normalizeEvents(on)
  updateDOMListeners(on, oldOn, add, remove, vnode.context)
  target = undefined
}
/**
 * add绑定事件
*/
function add (event, handler, once, capture, passive) {
  handler = withMacroTask(handler)
  if (once) handler = createOnceHandler(handler, event, capture)
  target.addEventListener(
    event,
    handler,
    supportsPassive ? {capture: passive} : capture
  )
}
/**
 * createOnceHandler函数可以实现once的功能
*/
function createOnceHandler (handler, event, capture) {
  const _target = target // 在闭包中保存当前目标元素
  return function onceHandler () {
    const res = handler.apply(null, arguments)
    if (res !== null)  {
      remove(event, onceHandler, capture, _target)
    }
  }
}
/**
 * remove方法解绑
*/
function remove (event, handler, capture, _target) {
  (_target || target).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  )
}
/**
 * 指令的处理逻辑分别监听了create、update与destroy
*/
export default {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode)
  }
}
/**
 * updateDirectives函数的实现
*/
function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode) 
  }
}
/**
 * _update函数的实现
 * normalizeDirectives函数将模板中使用的指令从用户注册的自定义指令集合中取出来
 * 
*/
function _update (oldVnode, vnode) {
  const isCreate = oldVnode === emptyNode // 判断虚拟节点是否是一个新创建的节点
  const isDestroy = vnode === emptyNode // 当新虚拟节点不存在而旧虚拟节点存在时为真
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context) // 旧的指令集合，指oldVnode中保存的指令
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context) // 新的指令集合，指vnode中保存的指令

  const dirsWithInsert = [] // 其中保存需要触发inserted指令钩子函数的指令列表
  const dirsWithPostpath = [] // 其中保存需要触发componentUpdated钩子函数的指令列表

  let key, oldDir, dir
  for (key in newDirs) {
    oldDir = oldDirs[key]
    dir = newDirs[key]
    if (!oldDir) {
      // 新指令，触发bind
      callHook(dir, 'bind', vnode, oldVnode)
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir)
      }
    } else {
      // 指令已存在，触发update
      dir.oldValue = oldDir.value
      callHook(dir, 'update', vnode, oldVnode)
      if (dir.def && dir.def.componetUpdated) {
        dirsWithPostpath.push(dir)
      }
    }
  }

  if (dirsWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirsWithInsert.length; i++) {
        callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
    }
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert)
    } else {
      callInsert()
    }
  }

  if (dirsWithPostpath.length) {
    mergeVNodeHook(vnode, 'postpatch', () => {
      for (let i = 0; i < dirsWithPostpath.length; i++) {
        callHook(dirsWithPostpath[i], 'componentUpdate', vnode, oldVnode)
      }
    })
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        //指令不再存在，触发unbind
        callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
      }
    }
  }
}
/**
 * callHook函数实现执行指令的钩子函数
 * 五个参数:
 * dir: 指令对象
 * hook：将要触发的钩子函数名
 * vnode：新虚拟节点
 * oldVnode：旧虚拟节点
 * isDestroy：是否为销毁,即当新虚拟节点不存在而旧虚拟节点存在时为真
*/
function callHook (dir, hook, vnode, oldVnode, isDestroy) {
  const fn = dir.def && dir.def[hook]
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy)
    } catch (e) {
      handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`)
    }
  }
}