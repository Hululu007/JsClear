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
    findVariable(name) {
        let definePaths = this.varPaths;
        for (let varPath of definePaths) {
            let node = varPath.node;
            if (node['id']['name'] == name)
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
Environment.environmentTypes = ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];
