"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const generator_1 = require("./generator");
const types_1 = require("@babel/types");
class Path {
    static copy(from, to) {
        to.node = from.node;
        to.type = from.type;
        to.parentPath = from.parentPath;
        to.isSkip = from.isSkip;
        if (from.type == "VariableDeclarator") {
            to.setReferencePaths(from.getReferencePaths());
        }
        let keys = types_1.VISITOR_KEYS[from.type];
        for (let key of keys) {
            let childPath = from.get(key);
            if (childPath == undefined)
                continue;
            else if (Array.isArray(childPath)) {
                to.setArray(key, childPath);
            }
            else {
                to.set(key, childPath);
            }
        }
    }
    constructor(node, parentPath, isSkip = false) {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.referencePaths = undefined;
        this.childPath = {}; // 浅拷贝
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
    replaceWith(node, isSkip) {
        throw new Error("这个path无可替代");
    }
    toString() {
        return (0, generator_1.node2js)(this.node);
    }
    get(key) {
        return this.childPath[key];
    }
    set(key, path) {
        this.childPath[key] = path;
    }
    setArray(key, path) {
        this.childPath[key] = path;
    }
    clearChildPath() {
        this.childPath = [];
    }
}
exports.Path = Path;
