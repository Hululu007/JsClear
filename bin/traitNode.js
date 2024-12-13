"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTraitNode = isTraitNode;
const utiles_1 = require("./utiles");
// 检查类型是否相等
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
        if (traitNodeType.includes('&') || !traitNodeType.includes('!'))
            throw new Error("暂不支持两个标识符");
        let types = traitNodeType.split('|');
        for (let type of types) {
            if (type == nodeType)
                return true;
        }
        return false;
    }
    else if (traitNodeType.includes('!')) {
        if (traitNodeType.includes('&') || !traitNodeType.includes('|'))
            throw new Error("暂不支持两个标识符");
        let types = traitNodeType.split('|');
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
                for (let secondaryKey in traitNode[key]) {
                    if (traitNode[key][secondaryKey] != node[key][secondaryKey])
                        return false;
                }
            }
            else if ((0, utiles_1.getType)(traitNode[key]) == 'array') {
                for (let i = 0; i < traitNode[key].length; ++i) {
                    // 可能会有 [, 1] 这样的
                    if (traitNode[key][i] == null) {
                        if (node[key][i] != null)
                            return false;
                    }
                    if ((0, utiles_1.isNode)(traitNode[key][i])) {
                        // 递归判断子树
                        return isTraitNode(node[key], traitNode[key]);
                    }
                }
            }
            else {
                if (traitNode[key] != node[key])
                    return false;
            }
        }
        else {
            // 递归判断子树
            return isTraitNode(node[key], traitNode[key]);
        }
    }
    return true;
}
