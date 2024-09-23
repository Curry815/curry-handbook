// Vue2 用的是 Object.defineProperty 劫持数据实现数据视图双向绑定
// Object.defineProperty 是可以劫持数组的，但是他劫持的是数组的每一个元素，是属性级别上的监听
const arr = [1,2,3,4]
Object.keys(arr).forEach(function(key) {
    Object.defineProperty(arr, key, {
        get: function() {
            console.log('key:' + key);
        },
        set: function(value) {
            console.log('value:' + value);
        }
    });
});

arr[1]; // key:1
arr[1] = 100; // value:100
 
// 真实情况：是Object.defineProperty 可以劫持数组而vue2没有用来劫持数组
/**
 * 原因：Object.defineProperty 是属性级别的劫持，如果按照上面的方式去劫持数组，随着数组长度增加，
 * 会有很大的性能损耗，导致框架的性能不稳定，因此vue2放弃一定的用户便捷性，提供了$set方法去操作数组，
 * 以最大程度保证框架的性能稳定。
 */
