// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType, isNode } = require('./utiles.js');
const { Path } = require("./Path.js");
const { VISITOR_KEYS } = require("@babel/types");
const { isTraitNode } = require("./traitNode.js");
const { Log } = require("./Log.js");
const { Environment, environmentTypes } = require("./Environment.js");

// 调试日志开关
let log = new Log(false);

// 指向解析node的头节点
let head;
// 环境
let currentEnvironment;
// 块作用域是否启用
let isBlockScopeEnabled;
// 先将所用的path建立完成，然后把将要访问的节点的引用缓存起来，修正VariableDeclarator的引用后再visit
let shouldVisit;

// 检查是否开辟新环境
function isCreateEnvironment(path)
{
    let type = path.type
    if (environmentTypes.includes(type))
    {
        isBlockScopeEnabled = false;
        return true;
    }

    if (type == "BlockStatement" && isBlockScopeEnabled) return true;

    return false;
}

// 更新环境
function updateEnvironment(path)
{
    if (path.type == 'VariableDeclarator')
    {
        currentEnvironment.defineVariable(path);
    }
}

// 深度优先
function visitQueue(queue, traitNode, visit)
{
    for (let index = 0; index < queue.length; index++)
    {
        let path = queue[index];
        _traverse(path.node, traitNode, visit, path)
    }
}

// 完善path然后交给visitQueue处理
function visitNodeArray(key, nodeArray, traitNode, visit, parentPath)
{
    // 把子node封装成path，入队
    let queue = [];
    for (let index = 0; index < nodeArray.length; ++index)
    {
        let path = new Path(nodeArray[index], parentPath, currentEnvironment);
        queue.push(path);
    }

    // 设置childPath
    if (queue.length == 1) parentPath.set(key, queue[0]);
    else parentPath.set(key, queue);
    // 深度优先遍历，方便解析作用域
    visitQueue(queue, traitNode, visit);
}

// 调试信息
function debugLog(path)
{
    let content = path + "";
    if ('Program' == path.type)
    {
        content = '...';
    }
    log.label(path.type, content);
}

// 更新path
function updatePath(path, traitNode, visit)
{
    // 标识符递归查找定义出，设置引用
    if (path.type == 'Identifier' && path.parentPath['type'] != 'VariableDeclarator')
    {
        let name = path.node['name'];
        let definePath = currentEnvironment.findVariable(name);
        if (definePath != null)
        {
            definePath.defineReference(path);
        }
    }

    // 为Path设置replaceWith
    path.replaceWith = function(node)
    {
        let parentPath = path.parentPath;
        let keys = Object.keys(parentPath.childPath);
        for (let key of keys)
        {
            if (parentPath.childPath[key] == path)
            {
                if (Array.isArray(parentPath.node[key]) && !Array.isArray(node)) 
                {
                    node = [node];
                }
                else if (!Array.isArray(parentPath.node[key]) && Array.isArray(node)) 
                {
                    throw new Error("原始node为非数组，替换node为数组");
                }
                
                parentPath.node[key] = node;

                traverse(head, traitNode, visit);
                return true;
            }
        }
        return false;
    }
}

// 递归遍历树
function _traverse(node, traitNode, visit, path)
{
    // 首次进来初始化一些值，最外层不设置环境
    if (null == path) 
    {
        // 头节点不设置replaceWith函数
        path = new Path(node, path, null);
        currentEnvironment = new Environment(path, null);
    }
    

    // 更新environment中变量的定义
    updateEnvironment(path);
    // 更新VariableDeclarator path中变量的引用
    updatePath(path, traitNode, visit)
    // 调试日志
    debugLog(path);
    // 判断是否符合特征码然后加入访问队列
    if (isTraitNode(node, traitNode)) 
    {
        shouldVisit.push(path);
    }

    // 保存来时环境
    let previousEnvironment = null;
    // 检查是否更新环境
    let isUpadeEnvironment = false;
    if (isCreateEnvironment(path))
    {
        isUpadeEnvironment = true;
        previousEnvironment = currentEnvironment;
        currentEnvironment = new Environment(path, previousEnvironment);
    }

    // 遍历子树
    const keys = VISITOR_KEYS[node["type"]];
    for (const key of keys)
    {
        let childNodeArray = node[key];
        if (!childNodeArray || childNodeArray.length == 0) continue;

        if (!Array.isArray(childNodeArray)) childNodeArray = [childNodeArray];
        visitNodeArray(key, childNodeArray, traitNode, visit, path);
    }

    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment)
    {
        currentEnvironment = previousEnvironment;
        isBlockScopeEnabled = true;
    }
}

// 对外函数
function traverse(node, traitNode, visit)
{
    if (node["type"] == 'File') node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");

    // 每次调用traverse的时候清理下缓存|初始化
    currentEnvironment = null;
    isBlockScopeEnabled = true;
    shouldVisit = [];
    head = node;

    // 只有第一次进来path是null
    _traverse(node, traitNode, visit, null);

    for (let i = 0; i < shouldVisit.length; ++i)
    {
        visit(shouldVisit[i])
    }
}

module.exports = {
	traverse,
    _traverse
};
