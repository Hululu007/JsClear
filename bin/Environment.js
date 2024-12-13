"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(path, parentEnvironment) {
        let cacheInstance = Environment.cache.get(path);
        if (cacheInstance == undefined) {
            this.path = path;
            this.parentEnvironment = parentEnvironment;
            this.definePaths = null;
            Environment.cache.set(path, this);
        }
        else {
            // 其实要个return就够了，这些为了不报错
            this.path = cacheInstance.path;
            this.parentEnvironment = cacheInstance.parentEnvironment;
            this.definePaths = cacheInstance.definePaths;
            return cacheInstance;
        }
    }
    clearCache() {
        Environment.cache = new WeakMap();
    }
    defineVariable(path) {
        if (this.definePaths == null) {
            this.definePaths = [];
        }
        this.definePaths.push(path);
    }
    findVariable(name) {
        let definePaths = this.definePaths;
        if (definePaths == null)
            return null;
        for (let i = definePaths.length - 1; i >= 0; --i) {
            let node = definePaths[i].node;
            if (node['id']['name'] == name)
                return definePaths[i];
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
