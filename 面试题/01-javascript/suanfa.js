// 一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个n级的台阶总共有多少种跳法？
// 思路1：递归
const numWays = function (n) {
    if (n <= 1) { return 1; }
    if (n === 2) { return 2; }
    return numWays(n - 1) + numWays(n - 2);
}

// 思路2：斐波那契数列
var numWays2 = function (n) {
    let a = 0;
    let b = 0;
    let result = 1;
    for (let i = 1; i <= n; ++i) {
        a = b;
        b = result;
        result = (a + b);
    }
    return result;
}

// 找出字符串中不含有重复字符的最长子串的长度
var lengthOfLongestSubstring = function (s) {
    let arr = [];
    let max = 0;
    for (let i = 0, len = s.length; i < len; ++i) {
        const sameIndex = arr.findIndex(item => item === s[i]);
        arr.push(s[i]);
        if (sameIndex > -1) {
            arr = arr.splice(sameIndex + 1);
        }
    }
}

// 给定一个字符串，判定其能否排列成回文串
var canPermutePalindrome = function (s) {
    const set = new Set();
    s.split('').forEach(key => {
        if (set.has(key)) {
            set.delete(key);
        } else {
            set.add(key);
        }
    });
    return set.size <= 1;
}

// 反转一个链表
// const node = {
//     val:
//     next:
// }

var reverseList = function (head) {
    if (!head) {
        return head;
    }

    let pre = null;
    let cur = head;

    while (cur) {
        const { next } = cur;
        cur.next = pre;
        pre = cur;
        cur = next;
    }

    return pre;
}

// 二叉树的遍历
// const node = {
//     value:
//     left:
//     right:
// }
// 前序： 根 左 右
var preorderTraversal = function (root) {
    if (!root) { return []; }
    let result = [];
    result.push(root.val);
    if (root.left) { result.push(...preorderTraversal(root.left)); }
    if (root.right) { result.push(...preorderTraversal(root.right)); }
    return result;
}

// 中序： 左 根 右
var inorderTraversal = function (root) {
    if (!root) { return []; }
    let result = [];
    result = result.concat(inorderTraversal(root.left));
    result.push(root.val);
    result = result.concat(inorderTraversal(root.right));
    return result;
}

// 后序： 左 右 根
var postorderTraversal = function (root) {
    if (!root) { return []; }
    let result = [];
    result.push(...postorderTraversal(root.left));
    result.push(...postorderTraversal(root.right));
    result.push(root.val);
    return result;
}

// 快速找到链表的中间节点
// 思路：快慢指针。快指针步进为2，慢指针步进为1，两个指针同时启动，当快指针走到底，慢指针指向的即是中间节点
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function findMiddleNode(head) {
    let slow = head;
    let fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}