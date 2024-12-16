"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTraitNode = isTraitNode;
const utiles_1 = require("./utiles");
const Scanner_1 = require("./Scanner");
const Parser_1 = require("./Parser");
// 解析结果的缓存
let parseCache = {};
// 检查是否有需要解析的特殊符号
function isNeadParse(type) {
    for (let c of Scanner_1.Scanner.typeChars) {
        if (type.includes(c))
            return true;
    }
    return false;
}
function check(nodeType, parserResult) {
    let union = parserResult.union;
    let complement = parserResult.complement;
    if (union.length != 0 && complement.length != 0)
        throw new Error("并集与补集不能共存，如果你确实需要共存，可以联系我修改.");
    else if (union.length != 0) {
        for (let type of union) {
            if (type == nodeType)
                return true;
        }
        return false;
    }
    else {
        for (let type of complement) {
            if (type == nodeType)
                return false;
        }
        return true;
    }
}
// 检查类型是否相等
function checkType(nodeType, traitNodeType) {
    if (typeof traitNodeType != "string")
        throw new Error("传入的类型不是字符串.");
    if (traitNodeType == '*')
        return true;
    if (!isNeadParse(traitNodeType))
        return nodeType == traitNodeType;
    let scanner = new Scanner_1.Scanner(traitNodeType);
    let tokens = scanner.getTokens();
    let scannerStr = Scanner_1.Scanner.getString(tokens);
    let parserResult = parseCache[scannerStr];
    if (parserResult == undefined) {
        let parser = new Parser_1.Parser(tokens);
        parserResult = parser.getResult();
    }
    return check(nodeType, parserResult);
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
