// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType, isNode } = require('./utiles.js');
const { Path } = require("./Path.js");
const { VISITOR_KEYS } = require("@babel/types");
const { hasTraitNode } = require("./traitNode.js");
const { Log } = require("./Log.js");

// 调试日志开关
let log = new Log(false);
// 环境
let currentEnvironment = null;
let previousEnvironment = null;
// 块作用域是否启用
let isBlockScopeEnabled = true;

// 检查是否开辟新环境
function isUpdateEnvironment(type)
{
    if (["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement"].includes(type))
    {
        isBlockScopeEnabled = false;
        return true;
    }

    if (type == "BlockStatement" && isBlockScopeEnabled) return true;

    return false;
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
    // 检查是否更新环境
    let isUpadeEnvironment = false;
    if (isUpdateEnvironment(parentPath.type))
    {
        isUpadeEnvironment = true;
        previousEnvironment = currentEnvironment;
        currentEnvironment = parentPath;
    }

    // 把子node封装成path，入队
    let queue = [];
    for (let index = 0; index < nodeArray.length; ++index)
    {
        let path = new Path(nodeArray[index], parentPath, currentEnvironment);
        queue.push(path);
    }

    // 设置childPath
    if (queue.length == 1) parentPath.set(key, queue[1]);
    else parentPath.set(key, queue);
    // 深度优先遍历，方便解析作用域
    visitQueue(queue, traitNode, visit);

    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment)
    {
        currentEnvironment = previousEnvironment;
        previousEnvironment = null;

        isBlockScopeEnabled = true;
    }
}

// 调试信息
function debugLog(path)
{
    log.label(path.type, path + "");
}

// 递归遍历树
function _traverse(node, traitNode, visit, path)
{
    // 首次进来初始化一些值，最外层不设置环境
    if (null == path) 
    {
        path = new Path(node, path, null);
        currentEnvironment = path;
    }
    
    // 判断和访问
    debugLog(path);
    if (hasTraitNode(node, traitNode)) visit(path);

    const keys = VISITOR_KEYS[node["type"]];
    for (const key of keys)
    {
        let childNodeArray = node[key];
        if (!childNodeArray || childNodeArray.length == 0) continue;

        if (!Array.isArray(childNodeArray)) childNodeArray = [childNodeArray];
        visitNodeArray(key, childNodeArray, traitNode, visit, path);
    }
}

// 对外函数
function traverse(node, traitNode, visit)
{
    if (node["type"] == 'File') node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");
    // 只有第一次进来path是null
    _traverse(node, traitNode, visit, null);
}

module.exports = {
	traverse,
    _traverse
};
