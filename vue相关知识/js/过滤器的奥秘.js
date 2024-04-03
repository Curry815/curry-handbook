/**
 * resolveFilter函数
*/
export function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}
/**
 * resolveAsset函数的实现
*/
export function resolveAsset (options, type, id, warnMissing) {
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // 先检查本地注册的变动
  if (hasOwn(assets, id)) { return assets[id] }
  // 再检查全局注册的变动
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // 检查原型链
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options)
  }
  return res
}
/**
 * parseFilters函数的实现
*/
export function parseFilters (exp) {
  let filters = exp.split('|')
  let expression = filters.shift().trim()
  let i
  if (filters) {
    for (let i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i].trim())
    }
  }
  return expression
}
function wrapFilter (exp, filter) {
  const i = filter.indexOf('(')
  if (i < 0) {
    return  `_f("${filter}")(${exp})`
  } else {
    const name = filter.slice(0, i)
    const args = filter.slice(i + 1)
    return  `_f("${name}")(${exp}, ${args})`
  }
}