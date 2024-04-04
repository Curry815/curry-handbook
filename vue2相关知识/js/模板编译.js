/**
 * VNode类型
*/
export class VNode {
  constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
  get child () {
    return this.componentInstance
  }
}
/**
 * 注释节点
*/
export const createEmptyVNode = text => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
/**
 * 真实的注释节点
 * <!-- 注释节点 -->
*/
/**
 * 所对应的vnode节点
*/
// {
//   text: "注释节点",
//   isComment: true
// }
/**
 * 文本节点
*/
export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}
/**
 * 创建克隆节点,克隆节点和被克隆节点之间唯一的区别是isCloned属性，克隆节点的isCloned属性为true，被克隆的原始节点的isCloned属性为false
*/
export function cloneVNode (vnode, deep) {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componenetOptions,
    vnode.asyncFactory    
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  if (deep && vnode.children) {
    cloned.children = cloneVNode(vnode.children)
  }
  return cloned
}
/**
 * 删除节点,removeVnodes删除一组指定的节点，removeNode删除视图中的单个节点。
*/
function removeVnodes (vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)
    }
  }
}
/**
 * removeNode的实现逻辑
*/
const nodeOps = {
  removeChild (node, child) {
    node.removeChild(child)
  }
}
function removeNode (el) {
  const parent = nodeOps.parentNode(el)
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el) // 将当前元素从它的父节点中删除，其中nodeOps是对节点操作的封装
  }
}
/**
 * 在start钩子函数中，使用3个参数来构建一个元素类型的AST节点。
*/
function createASTElement (tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    parent,
    children: []
  }
}
parseHTML(template, {
  start (tag, attrs, unary) {
    let element = createASTElement(tag, attrs, currentParent)
  },
  end (tag, attrs, unary) {
    let element = createASTElement(tag, attrs, currentParent)
  },
  chars (text) {
    let element = {type: 3, text}
  },
  comment (text) {
    let element = {type: 3, text, isComment: true}
  }
})
/**
 * HTML解析器
*/
parseHTML(template, {
  start (tag, attrs, unary) {
      // 每当解析到标签的开始位置时，触发该函数
  },
  end () {
      // 每当解析到标签的结束位置时，触发该函数
  },
  chars (text) {
      // 每当解析到文本时，触发该函数
      text = text.trim()
      if (text) {
        const children = currentParent.children
        let expression
        if (expression = parseText(text)) {
          children.push({
            type: 2,
            expression,
            text,
          })
        } else {
          children.push({
            type: 3,
            text
          })
        }
      }
  },
  comment (text) {
      // 每当解析到注释时，触发该函数
  }
})
/**
 * 文本解析器解析带变量的文本
*/
function toString (value) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}
/**
 * 判断文本是否为带变量的文本
*/
function parseText (text) {
  const tagRE = /\{\{((?:.|\n)+?)\}\}/g
  if (!tagRE(text)) {
    return // 如果是纯文本则直接返回
  }

  const tokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index
  while ((math = tagRE.exec(text))) {
    index = match.index
    // 先把 {{ 前边的文本添加到tokens中
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    // 把变量改成_s(x)这样的形式也添加到数组中
    tokens.push(`_s(${math[1].trim()})`)
    // 设置lastIndex来保证下一轮循环时，正则表达式不再重复匹配已经解析过的文本
    lastIndex = index + math[0].length
  }

  // 当所有变量都处理完毕后，如果最后一个变量右边还有文本，就将本文添加到数组中
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return tokens.join('+')
}
/**
 * 静态节点的解析
*/
export function optimize (root) {
  if (!root) return
  // 第一步：标记所有静态节点
  markStatic(root)
  // 第二步：标记所有静态根节点
  markStaticRoots(root)
}
/**
 * 找出所有静态节点并标记
 * 先使用isStatic函数判断节点是否为静态节点，然后如果节点的类型等于1，说明节点是元素节点，那么循环该节点的子节点，调用markStatic函数用同样的处理逻辑来处理子节点
*/
function markStatic (node) {
  node.static = isStatic(node)
  if (node.type === 1) {
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)

      // 打完标记之后重新校验当前节点是否为静态节点
      if (!child.static) {
        node.static = false
      }
    }
  }
}
/**
 * isStatic函数判断一个节点是否是静态节点的呢？
*/
function isStatic (node) {
  if (node.type === 2) { // 带变量的动态文本节点
    return false
  }
  if (node.type === 3) { // 不带变量的纯文本节点
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // 没有绑定变量
    !node.if && !node.for && // 没有v-if或v-for或v-else
    !isBuiltInTag(node.tag) && // 不是内置标签
    isPlatformReservedTag(node.tag) && // 不是组件
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
/**
 * 找出所有静态根节点并标记
 * 首先判断标记当前节点是否是静态根节点，其次判断标记子节点是否是静态根节点
*/
function markStaticRoots (node) {
  if (node.type === 1) {
    // 要使节点符合静态根节点的要求，它必须有子节点
    // 这个子节点不能是只有一个静态文本的子节点，否则优化成本过高
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
  }

  if (node.children) {
    for (let i = 0, l = node.children.length; i < l; i++) {
      markStaticRoots(node.children[i])
    }
  }
}
/**
 * 元素节点的处理
 * 这段代码主要逻辑是用genData和genChildren分别获取data和children，然后将它们分别拼到指定的位置，最后把拼好的"_c(tagName, data, children)"返回，即可得到最终的代码字符串
*/
function genElement (el, state) {
  // 如果el.plain是true，则说明节点没有属性
  const data = el.plain ? undefined : genData(el, state)

  const children = genChildren(el, state)
  code = `_c('${el.tag}'${
    data ? `,${data}` : '' // 如果data不为空，则拼接上data
  }${
    children ? `,${children}` : '' // 如果children不为空，则拼接上children
  })`
  return code
}
/**
 * data如何生成？
 * 
*/
function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // key
  if (el.key) {
    data += `key:${el.key},`
  }
  //ref
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  // pre
  if (el.pre) {
    data += `pre:true,`
  }
  // 类似的还有很多种情况
  data = data.replace(/,$/, '') + '}'
  return data
}
/**
 * 生成子节点列表字符串也是拼字符串。
*/
function genChildren (el, state) {
  const children = el.children
  if (children.length) {
    return `[${children.map(c => genNode(c, state)).join(',')}]`
  }
}
function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}
/**
 * 生成文本节点
*/
function genText (text) {
  return `_v(${text.type === 2
    ? text.expression // 是带变量的文本
    : JSON.stringify(text.text) // 不带变量的文本，使用JSON.stringify可以给文本包装成一层字符串 '"Hello Berwin"' => "'Hello'"
  })`
}
/**
 * 生成注释节点
*/
function genComment (comment) {
  return `_e(${JSON.stringify(comment.text)})`
}
