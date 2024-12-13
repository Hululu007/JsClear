"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = getType;
exports.debug = debug;
exports.isNode = isNode;
exports.randomName = randomName;
const crypto_1 = __importDefault(require("crypto"));
// 获取数据类型
function getType(target) {
    if (Array.isArray(target))
        return 'array';
    else if (target && target.buffer)
        return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)
        return 'null';
    return typeof target;
}
// 标签打印
function debug(label = "", message = "") {
    if (label != "" && message == "") {
        console.log(label);
    }
    else {
        console.log(`[${label}] ${message}`);
    }
}
// 随机生成名字
function randomName(prefix = "random") {
    const randomBytes = crypto_1.default.randomBytes(8);
    const randomHex = randomBytes.toString('hex');
    return `${prefix}_${randomHex}`;
}
// 判断是否是 node 节点
function isNode(n) {
    if (getType(n) != 'object' || n['type'] == undefined)
        return false;
    else
        return true;
}
