// 实现响应式数据+依赖收集
// class Component {
//     data = {name: ''};
//     constructor() {}
//     render() {
//         console.log(`render - name:${this._data.name}`);
//     }
// }

// // 要求一下代码需要触发render，且同步变更需要合并
// const com = new Component();
// com.data.name = 'a';
// com.data.name = 'b';
// com.data.name = 'Alice';
// // 第一次触发render

// setTimeout(() => {
//     com.data.name = 'Bob';
// });

// // 第二次触发render

// 通过Proxy触发响应式，加上promise实现依赖收集
class Component {
    _data = {name: ''};
    pending = false;
    constructor() {
        this.data = new Proxy(this._data, {
            set: (target, key, value) => {
                this._data[key] = value;
                if (!this.pending) {
                    this.pending = true;
                    Promise.resolve().then(() => {
                        this.pending = false;
                        this.render();
                    });
                }
            }
        });
    }
    render() {
        console.log(`render - name:${this._data.name}`);
    }
}

// 要求一下代码需要触发render，且同步变更需要合并
const com = new Component();
com.data.name = 'a';
com.data.name = 'b';
com.data.name = 'Alice';
// 第一次触发render

setTimeout(() => {
    com.data.name = 'Bob';
}, 0);

