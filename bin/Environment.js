"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(parentEnvironment) {
        this.parentEnvironment = parentEnvironment;
        this.varPaths = new Set();
        this.unVarPaths = new Map();
    }
    clearVarPaths() {
        this.varPaths = new Set();
    }
    defineVariable(path) {
        this.varPaths.add(path);
    }
    // 递归寻找
    findVariable(name) {
        let definePaths = this.varPaths;
        for (let varPath of definePaths) {
            let node = varPath.node;
            if (node['name'] == name)
                return varPath;
        }
        if (this.parentEnvironment != null) {
            return this.parentEnvironment.findVariable(name);
        }
        else
            return null;
    }
}
exports.Environment = Environment;
// 环境
// 这些节点需要遇到就解析作用域而不是遇到其子节点的"BlockStatement"时
Environment.environmentTypes = [
    "IfStatement", "ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "ArrowFunctionExpression",
    "FunctionExpression"
];
// 其子节点有"BlockStatement"也不需要new新环境
Environment.notEnvironmentTypes = ["TryStatement", "CatchClause"];
// 需要单独处理的节点
Environment.specialEnvTypes = ["FunctionDeclaration", "ObjectMethod", "ClassMethod"];
