"use strict";
// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = traverse;
const utiles_1 = require("./utiles");
const Path_1 = require("./Path");
const types_1 = require("@babel/types");
const traitNode_1 = require("./traitNode");
const Log_1 = require("./Log");
const Environment_1 = require("./Environment");
// 调试日志开关
let log = new Log_1.Log(false);
// 环境
let currentEnvironment;
// 纯块作用域是否启用-for等与纯块作用域冲突
let isBlockScopeEnabled;
// path与node之间的桥梁
let pathCache;
// 调试信息
function debugLog(path) {
    let content = path + "";
    if ('Program' == path.type) {
        content = '...';
    }
    log.label(path.type, content);
}
// 检查是否开辟新环境
function isCreateEnvironment(path) {
    let type = path.type;
    if (Environment_1.Environment.environmentTypes.includes(type)) {
        isBlockScopeEnabled = false;
        return true;
    }
    // 单个BlockStatement
    if (type == "BlockStatement" && isBlockScopeEnabled)
        return true;
    return false;
}
// path.findReference 
function implementPathFindReference(path) {
    path.findReference = function () {
        let targetName = this.node["id"]["name"];
        currentEnvironment = this.environment;
        // 防止path.replaceWith后发生意外
        currentEnvironment.clearVarPaths();
        // 每次都从当前环境重新解析
        function updateEnvDefineVar(path) {
            if (path.type == "VariableDeclarator") {
                // 清除上次缓存
                path.clearReference();
                currentEnvironment.defineVariable(path);
            }
            else if (path.type == "Identifier" && path.parentPath.type != "VariableDeclarator") {
                let name = path.node["name"];
                if (name == targetName) {
                    let varPath = currentEnvironment.findVariable(name);
                    if (varPath != null) {
                        varPath.addReference(path);
                    }
                }
            }
        }
        _traverse(currentEnvironment.path, updateEnvDefineVar, false);
        return this.getReferencePaths();
    };
}
// path.replaceWith
function implementPathReplaceWith(path) {
    let KEYS = types_1.VISITOR_KEYS;
    path.replaceWith = function (newNode, isSkip) {
        if (typeof isSkip != "boolean")
            throw new Error("需要传入一个bool值，决定是否跳过替换内容");
        let parentPath = this.parentPath;
        let parentNode = this.parentPath.node;
        let oldNode = this.node;
        // 修正parentNode
        const keys = KEYS[parentPath.type];
        for (const key of keys) {
            let node = parentNode[key];
            if (!node)
                continue;
            if (Array.isArray(node)) {
                let index = 0;
                for (; index < node.length; index++) {
                    if (node[index] == oldNode)
                        break;
                }
                parentNode[key][index] = newNode;
                break;
            }
            else {
                if (node == oldNode) {
                    parentNode[key] = newNode;
                    break;
                }
            }
        }
        // 修正this
        this.node = newNode;
        this.isSkip = isSkip;
        this.type = newNode["type"];
        this.clearReference();
        // 修正pathCache
        pathCache.delete(oldNode);
        pathCache.set(newNode, this);
        // 解析新的node
        currentEnvironment = this.environment;
        _traverse(this, () => { }, isSkip);
    };
}
// path.get
function implementPathGet(path) {
    path.get = function (key) {
        let node = this.node[key];
        if ((0, utiles_1.isNode)(node)) {
            return pathCache.get(node);
        }
        else if (Array.isArray(node)) {
            let pathArray = [];
            for (let n of node) {
                if ((0, utiles_1.isNode)(n)) {
                    pathArray.push(pathCache.get(n));
                }
                else {
                    pathArray.push(n);
                }
            }
            return pathArray;
        }
        else
            return node;
    };
}
// 为path添加一些方法
function updatePath(path) {
    let type = path.type;
    if (type == 'VariableDeclarator') {
        implementPathFindReference(path);
    }
    if (type != "Program" && type != "File") {
        implementPathReplaceWith(path);
    }
    implementPathGet(path);
}
// 深度优先
function visitQueue(queue, visit, isNewPathSetSkip) {
    for (let index = 0; index < queue.length; index++) {
        let path = queue[index];
        _traverse(path, visit, isNewPathSetSkip);
    }
}
// 处理单个node
function visitNodeSingle(parentPath, node, visit, isNewPathSetSkip) {
    // 如果已经有了Path就不再创建了
    let path = pathCache.get(node);
    if (path == undefined) {
        // 封装成Path
        path = new Path_1.Path(node, parentPath, currentEnvironment, isNewPathSetSkip);
        // 设置缓存
        pathCache.set(node, path);
    }
    // 深度优先遍历，方便解析作用域
    visitQueue([path], visit, isNewPathSetSkip);
}
// 处理node数组
function visitNodeArray(parentPath, nodeArray, visit, isNewPathSetSkip) {
    let queue = [];
    for (let index = 0; index < nodeArray.length; ++index) {
        let path = pathCache.get(nodeArray[index]);
        if (path == undefined) {
            // 封装成Path
            path = new Path_1.Path(nodeArray[index], parentPath, currentEnvironment, isNewPathSetSkip);
            // 设置缓存
            pathCache.set(nodeArray[index], path);
        }
        queue.push(path);
    }
    // 深度优先遍历，方便解析作用域
    visitQueue(queue, visit, isNewPathSetSkip);
}
// 递归遍历树-构建path
function _traverse(path, visit, isNewPathSetSkip) {
    let node = path.node;
    // 遍历到的每个Path在这里处理
    visit(path);
    // 保存来时环境
    let previousEnvironment;
    // 检查是否更新环境
    let isUpadeEnvironment = false;
    if (isCreateEnvironment(path)) {
        isUpadeEnvironment = true;
        previousEnvironment = currentEnvironment;
        // 做了缓存机制，相同的path对象对应相同的Environment
        currentEnvironment = new Environment_1.Environment(path, previousEnvironment);
    }
    // 遍历子树
    const keys = types_1.VISITOR_KEYS[node["type"]];
    for (const key of keys) {
        let childNode = node[key];
        if (!childNode)
            continue;
        if (!Array.isArray(childNode))
            visitNodeSingle(path, childNode, visit, isNewPathSetSkip);
        else
            visitNodeArray(path, childNode, visit, isNewPathSetSkip);
    }
    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment) {
        currentEnvironment = previousEnvironment;
        isBlockScopeEnabled = true;
    }
}
// 递归遍历树-访问path
function _traverseNode(node, traitNode, visit) {
    let path = pathCache.get(node);
    if (path == undefined)
        throw new Error("呃....发生了一个意外的错误.");
    // 调试日志
    debugLog(path);
    // 判断是否符合特征码然后访问
    if ((0, traitNode_1.isTraitNode)(node, traitNode) && path.isSkip == false) {
        visit(path);
    }
    const keys = types_1.VISITOR_KEYS[node["type"]];
    for (const key of keys) {
        let childNode = node[key];
        if (!childNode)
            continue;
        if (!Array.isArray(childNode)) {
            _traverseNode(childNode, traitNode, visit);
        }
        else {
            for (let n of childNode) {
                if (n == null)
                    continue;
                _traverseNode(n, traitNode, visit);
            }
        }
    }
}
// 对外函数
function traverse(node, traitNode, visit) {
    if (node["type"] != 'Program')
        throw new Error("这个函数只能用于最外层.");
    if (!(0, utiles_1.isNode)(node))
        throw new Error("非node节点");
    let headPath = new Path_1.Path(node, null, null);
    let headEnvironment = new Environment_1.Environment(headPath, null);
    headPath.environment = headEnvironment;
    // 初始化全局变量
    isBlockScopeEnabled = true;
    currentEnvironment = headEnvironment;
    pathCache = new WeakMap();
    pathCache.set(node, headPath);
    // 构建
    _traverse(headPath, updatePath, false);
    // 访问
    _traverseNode(node, traitNode, visit);
    Environment_1.Environment.clearCache();
    pathCache = new WeakMap();
}
