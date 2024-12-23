"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const Environment_1 = require("./Environment");
const generator_1 = require("./generator");
const traitNode_1 = require("./traitNode");
const utiles_1 = require("./utiles");
class Path {
    constructor(node, parentPath, environment, isSkip = false) {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.environment = environment;
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
        throw new Error("这个节点不能调用.");
    }
    // 判断是否是定义path
    isVarNode() {
        if ("Identifier" != this.type)
            return false;
        let type = this.parentPath.type;
        if ('VariableDeclarator' == type)
            return true;
        if (Environment_1.Environment.functionTypes.includes(type))
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
