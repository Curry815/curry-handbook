// 如何遍历对象
// for in
const obj = {a: 1, b: 2, c: 3};
for (let key in obj) {
    console.log(key, obj[key]);
}

// Object.keys
const keys = Object.keys(obj);
keys.forEach(key => {
    console.log(key, obj[key]);
});

// Object.entries
const entries = Object.entries(obj);
entries.forEach(([key, value]) => {
    console.log(key, value);
});

// Reflect.ownKeys
Reflect.ownKeys(obj).forEach(key => {
    console.log(key, obj[key]);
})