"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(path, parentEnvironment) {
        this.path = path;
        this.parentEnvironment = parentEnvironment;
        this.varPaths = new Set();
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
// 这些节点需要遇到就解析作用域而不是遇到其子节点的"BlockStatement"时
Environment.loopTypes = ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement"];
Environment.functionTypes = ["ArrowFunctionExpression", "FunctionDeclaration", "ObjectMethod", "ClassMethod"];
Environment.environmentTypes = ["IfStatement"].concat(Environment.loopTypes).concat(Environment.functionTypes);
