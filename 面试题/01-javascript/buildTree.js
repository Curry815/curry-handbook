const list = [
    {'id': 'a2', 'label': '1', 'pid': 'a1'},
    {'id': 'a3', 'label': '2', 'pid': 'a17'},
    {'id': 'a1', 'label': '3', 'pid': 'root'},
    {'id': 'a4', 'label': '4', 'pid': 'a3'},
    {'id': 'a5', 'label': '5', 'pid': 'a4'},
    {'id': 'ax', 'label': '6', 'pid': 'a5'},
    {'id': 'ay', 'label': '7', 'pid': 'a5'},
    {'id': 'a6', 'label': '8', 'pid': 'a4'},
    {'id': 'a7', 'label': '9', 'pid': 'a6'},
    {'id': 'a9', 'label': '10', 'pid': 'a7'},
    {'id': 'a10', 'label': '11', 'pid': 'a9'},
    {'id': 'a11', 'label': '12', 'pid': 'a10'},
    {'id': 'a12', 'label': '13', 'pid': 'a10'},
    {'id': 'a13', 'label': '14', 'pid': 'a10'},
    {'id': 'a14', 'label': '15', 'pid': 'a11'},
    {'id': 'a15', 'label': '16', 'pid': 'a12'},
    {'id': 'a16', 'label': '17', 'pid': 'a13'},
    {'id': 'a17', 'label': '18', 'pid': 'a2'},
];

function buildTree(node, list) {
    const children = list.filter(item => item.pid === node.id);
    if (children.length > 0) {
        node.children = children.map(item => buildTree(item, list));
    }
    return node;
}
const tree = buildTree({id: 'root', name: 'root', pid: null}, list);

console.log(JSON.stringify(tree));
