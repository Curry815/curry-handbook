function isExit3(list) {
    return list.some(item => item === 3);
}

console.log(isExit3([1, 2, 3, 4, 5])); // true