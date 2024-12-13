"use strict";
// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = traverse;
exports._traverse = _traverse;
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
// 块作用域是否启用
let isBlockScopeEnabled;
let currentPath;
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
function implementPathFindReference(path, traitNode, visit) {
    path.findReference = function () {
        // 每次都从当前环境重新解析
        function updateEnvDefineVar(path, traitNode, visit) {
            if (path.type == "VariableDeclarator") {
                // 清除上次缓存
                path.clearReference();
                currentEnvironment.defineVariable(path);
            }
            else if (path.type == "Identifier" && path.parentPath.type != "VariableDeclarator") {
                let name = path.node["name"];
                let varPath = currentEnvironment.findVariable(name);
                if (varPath != null) {
                    varPath.addReference(path);
                }
            }
        }
        _traverse(currentEnvironment.path, traitNode, visit, updateEnvDefineVar, false);
        // 解析后置空
        currentEnvironment.definePaths = null;
        return this.getReferencePaths();
    };
}
// path.replaceWith
function implementPathReplaceWith(path, traitNode, visit) {
    path.replaceWith = function (newNode, isSkip) {
        if (!(0, utiles_1.isNode)(newNode))
            throw new Error("需要传入一个node.");
        if (typeof isSkip != "boolean")
            throw new Error("第二个参数isSkip必须是一个布尔值.");
        let parentPath = this.parentPath;
        this.node = newNode;
        this.type = newNode.type;
        this.isSkip = isSkip;
        this.clearChildPath();
        this.clearReference();
        // 修复父node和父path
        let keys = types_1.VISITOR_KEYS[parentPath.type];
        for (let key of keys) {
            let childPath = parentPath.get(key);
            if (childPath == undefined)
                continue;
            else if (Array.isArray(childPath)) {
                let index;
                for (index = 0; index < childPath.length; index++) {
                    if (childPath[index].node == newNode) {
                        parentPath.node[key][index] = newNode;
                        childPath[index] = this;
                        parentPath.setArray(key, childPath);
                    }
                }
            }
            else {
                if (childPath.node == newNode) {
                    parentPath.node[key] = newNode;
                    parentPath.set(key, this);
                }
            }
        }
        if (currentPath != this)
            throw new Error("不是当前节点不能替换，不可以改变历史");
        _traverse(this, { type: "ovo" }, () => { }, () => { }, isSkip);
    };
}
// 为path添加一些方法
function updatePath(path, traitNode, visit) {
    let type = path.type;
    if (type == 'VariableDeclarator') {
        implementPathFindReference(path, traitNode, visit);
    }
    if (type != "Program" && type != "File") {
        implementPathReplaceWith(path, traitNode, visit);
    }
}
// 访问
function visitPath(path, traitNode, visit) {
    let node = path.node;
    // 调试日志
    debugLog(path);
    // 判断是否符合特征码然后访问
    if ((0, traitNode_1.isTraitNode)(node, traitNode) && path.isSkip == false) {
        updatePath(path, traitNode, visit);
        visit(path);
    }
}
// 深度优先
function visitQueue(queue, traitNode, visit, dealWithPath, isNewPathSetSkip) {
    for (let index = 0; index < queue.length; index++) {
        let path = queue[index];
        _traverse(path, traitNode, visit, dealWithPath, isNewPathSetSkip);
    }
}
// 处理单个node
function visitNodeSingle(parentPath, key, node, traitNode, visit, dealWithPath, isNewPathSetSkip) {
    // 如果已经有了Path就不再创建了
    let path = parentPath.get(key);
    if (path == undefined) {
        // 封装成Path
        path = new Path_1.Path(node, parentPath, isNewPathSetSkip);
        // 设置childPath
        parentPath.set(key, path);
    }
    // 深度优先遍历，方便解析作用域
    visitQueue([path], traitNode, visit, dealWithPath, isNewPathSetSkip);
}
// 处理node数组
function visitNodeArray(parentPath, key, nodeArray, traitNode, visit, dealWithPath, isNewPathSetSkip) {
    // 如果已经有了queue就不再创建了
    let queue = parentPath.get(key);
    if (undefined == queue) {
        // 把子node封装成path，入队
        queue = [];
        for (let index = 0; index < nodeArray.length; ++index) {
            // 封装成Path
            let path = new Path_1.Path(nodeArray[index], parentPath, isNewPathSetSkip);
            queue.push(path);
        }
        // 设置childPath
        parentPath.setArray(key, queue);
    }
    // 深度优先遍历，方便解析作用域
    visitQueue(queue, traitNode, visit, dealWithPath, isNewPathSetSkip);
}
// 递归遍历树
function _traverse(path, traitNode, visit, dealWithPath, isNewPathSetSkip) {
    let node = path.node;
    // 遍历到的每个Path在这里处理
    currentPath = path;
    dealWithPath(path, traitNode, visit);
    // 保存来时环境
    let previousEnvironment;
    // 检查是否更新环境
    let isUpadeEnvironment = false;
    if (isCreateEnvironment(path)) {
        isUpadeEnvironment = true;
        previousEnvironment = currentEnvironment;
        currentEnvironment = new Environment_1.Environment(path, previousEnvironment);
    }
    // 遍历子树
    const keys = types_1.VISITOR_KEYS[node["type"]];
    for (const key of keys) {
        let childNode = node[key];
        if (!childNode || childNode.length == 0)
            continue;
        if (!Array.isArray(childNode))
            visitNodeSingle(path, key, childNode, traitNode, visit, dealWithPath, isNewPathSetSkip);
        else
            visitNodeArray(path, key, childNode, traitNode, visit, dealWithPath, isNewPathSetSkip);
    }
    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment) {
        currentEnvironment = previousEnvironment;
        isBlockScopeEnabled = true;
    }
}
// 对外函数
function traverse(node, traitNode, visit) {
    if (node["type"] == 'File')
        node = node["program"];
    if (!(0, utiles_1.isNode)(node))
        throw new Error("非node节点");
    // 初始化
    let path = new Path_1.Path(node, null);
    currentEnvironment = new Environment_1.Environment(path, null);
    ;
    isBlockScopeEnabled = true;
    _traverse(path, traitNode, visit, visitPath, false);
}
