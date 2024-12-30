"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const generator_1 = require("./generator");
const traitNode_1 = require("./traitNode");
const utiles_1 = require("./utiles");
class Path {
    constructor(node, parentPath, isSkip = false) {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.initReference();
    }
    // api
    toString() {
        return (0, generator_1.node2js)(this.node);
    }
    isTraitNode(traitNode) {
        if (!(0, utiles_1.isNode)(traitNode))
            throw new Error("需要传入一个node.");
        return (0, traitNode_1.isTraitNode)(this.node, traitNode);
    }
    replaceWith(node, isSkip) {
        throw new Error("这个path无可替代");
    }
    get(key) {
        throw new Error("呃...非常抱歉，这好像是一个bug.");
    }
    findReference() {
        if (this.type != "Identifier")
            throw new Error("非Identifier节点不能调用这个方法.");
        return this.referencePaths;
    }
    // 判断是否是定义path
    isVarNode() {
        if ("Identifier" != this.type)
            return false;
        let parentType = this.parentPath.type;
        // ObjectProperty 特殊处理
        if (Path.varTypes.includes(parentType))
            return true;
        return false;
    }
    // 辅助函数
    initReference() {
        if (this.isVarNode()) {
            this.referencePaths = [];
        }
        else {
            this.referencePaths = undefined;
        }
    }
}
exports.Path = Path;
// 可直接确定为定义变量的节点
Path.varTypes = [
    "FunctionDeclaration", , "ClassMethod", "ArrowFunctionExpression", "FunctionExpression",
    "VariableDeclarator"
];
