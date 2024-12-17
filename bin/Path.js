"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const generator_1 = require("./generator");
class Path {
    constructor(node, parentPath, environment, isSkip = false) {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.environment = environment;
    }
    toString() {
        return (0, generator_1.node2js)(this.node);
    }
    replaceWith(node, isSkip) {
        throw new Error("这个path无可替代");
    }
    get(key) {
        throw new Error("呃...非常抱歉，这好像是一个bug.");
    }
    addReference(path) {
        if (this.type != "VariableDeclarator")
            throw new Error("非VariableDeclarator节点不能调用.");
        if (this.referencePaths == undefined) {
            this.referencePaths = [];
        }
        this.referencePaths.push(path);
    }
    clearReference() {
        if (this.type == "VariableDeclarator") {
            this.referencePaths = [];
        }
        else {
            this.referencePaths = undefined;
        }
    }
    getReferencePaths() {
        if (this.type != "VariableDeclarator")
            throw new Error("非VariableDeclarator节点不能调用.");
        return this.referencePaths;
    }
    setReferencePaths(referencePaths) {
        if (this.type != "VariableDeclarator")
            throw new Error("非VariableDeclarator节点不能调用.");
        this.referencePaths = referencePaths;
    }
    findReference() {
        throw new Error("非VariableDeclarator节点不能调用.");
    }
}
exports.Path = Path;
