"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(path, parentEnvironment) {
        let cacheInstance = Environment.cache.get(path);
        if (cacheInstance == undefined) {
            this.path = path;
            this.parentEnvironment = parentEnvironment;
            this.varPaths = new Set();
            Environment.cache.set(path, this);
        }
        else {
            // 其实要个return就够了，这些为了不报错
            this.path = cacheInstance.path;
            this.parentEnvironment = cacheInstance.parentEnvironment;
            this.varPaths = cacheInstance.varPaths;
            return cacheInstance;
        }
    }
    clearVarPaths() {
        this.varPaths = new Set();
    }
    static clearCache() {
        Environment.cache = new WeakMap();
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
Environment.cache = new WeakMap();
