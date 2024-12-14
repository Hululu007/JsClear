"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTraitNode = isTraitNode;
const utiles_1 = require("./utiles");
// import { Parser }  from "./Parser";
// 检查类型是否相等 !
// function checkType(nodeType: string, traitNodeType: string)
// {
//     if (typeof traitNodeType != "string") throw new Error("传入的类型不是字符串.");
//     if (traitNodeType == '*') return true;
//     if (!traitNodeType.includes('|') && !traitNodeType.includes('&') && !traitNodeType.includes('!'))
//     {
//         return nodeType == traitNodeType;
//     }
//     let scanner = new Scanner(traitNodeType);
//     let tokens = scanner.getTokens();
//     let parser = new Parser(tokens);
//     return parser.check(nodeType);
// }
function checkType(nodeType, traitNodeType) {
    if (typeof traitNodeType != "string")
        throw new Error("传入的类型不是字符串.");
    if (traitNodeType == '*')
        return true;
    if (traitNodeType.includes('|')) {
        if (traitNodeType.includes('!'))
            throw new Error("暂不支持两个标识符");
        let types = traitNodeType.split('|');
        for (let type of types) {
            if (type == nodeType)
                return true;
        }
        return false;
    }
    else if (traitNodeType.includes('!')) {
        if (traitNodeType.includes('|'))
            throw new Error("暂不支持两个标识符");
        let types = traitNodeType.split('!');
        if (types.length != 2)
            throw new Error("暂不支持多个!");
        if (types[1] != nodeType)
            return true;
        else
            return false;
    }
    else {
        return nodeType == traitNodeType;
    }
}
// 解析traitNode中的数组
function parseArray(nodeArray, traitNodeArray) {
    if (traitNodeArray.length % 2 != 0)
        new Error("传入的traitNode格式不对.");
    for (let i = 0; i < traitNodeArray.length; i += 2) {
        let index = traitNodeArray[i];
        let traitNode = traitNodeArray[i + 1];
        if ((0, utiles_1.isNode)(traitNode)) {
            if (!isTraitNode(nodeArray[index], traitNode))
                return false;
        }
        else {
            if (nodeArray[index] != traitNode)
                return false;
        }
    }
    return true;
}
// 解析traitNode中的不包含子node的object
function parseObject(node, traitNode) {
    for (let key in traitNode) {
        if (traitNode[key] != node[key])
            return false;
    }
    return true;
}
// 判断是否符合特征
function isTraitNode(node, traitNode) {
    if (!(0, utiles_1.isNode)(traitNode))
        throw new Error("传入的特征节点不是node");
    if (!checkType(node['type'], traitNode['type']))
        return false; // 提升效率
    // 判断除去 node 节点的属性
    for (let key in traitNode) {
        if ('type' == key)
            continue;
        if (node[key] == undefined)
            return false; // 提升效率
        if (!(0, utiles_1.isNode)(traitNode[key])) {
            // 不包含子node的object
            if ((0, utiles_1.getType)(traitNode[key]) == 'object') {
                if (!parseObject(node[key], traitNode[key]))
                    return false;
            }
            else if ((0, utiles_1.getType)(traitNode[key]) == 'array') {
                if (!parseArray(node[key], traitNode[key]))
                    return false;
            }
            else {
                if (traitNode[key] != node[key])
                    return false;
            }
        }
        else {
            // 递归判断子树
            if (!isTraitNode(node[key], traitNode[key]))
                return false;
        }
    }
    return true;
}
