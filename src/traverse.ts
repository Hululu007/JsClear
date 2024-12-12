// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

import { isNode }  from "./utiles";
import { Path, Node }  from "./Path";
import { VISITOR_KEYS }  from "@babel/types";
import { isTraitNode }  from "./traitNode";
import { Log }  from "./Log";
import { Environment }  from "./Environment";

// 调试日志开关
let log = new Log(false);

// 环境
let currentEnvironment: Environment | null;
// 块作用域是否启用
let isBlockScopeEnabled: boolean;

// 声明
type VisitCallBack = (path: Path) => void;

// 调试信息
function debugLog(path: Path)
{
    let content = path + "";
    if ('Program' == path.type)
    {
        content = '...';
    }
    log.label(path.type, content);
}

// 检查是否开辟新环境
function isCreateEnvironment(path: Path)
{
    let type = path.type

    if (Environment.environmentTypes.includes(type))
    {
        isBlockScopeEnabled = false;
        return true;
    }

    // 单个BlockStatement
    if (type == "BlockStatement" && isBlockScopeEnabled) return true;

    return false;
}

// 更新path
function updatePath(path: Path)
{
    // 标识符递归查找定义出，设置引用
    if (path.type == 'VariableDeclarator')
    {
        path.findReference = function()
        {
            return path;
        }
    }

    path.replaceWith = function(node: Node)
    {
        
    }
}

// 深度优先
function visitQueue(queue: Array<Path>, traitNode: Node, visit: VisitCallBack)
{
    for (let index = 0; index < queue.length; index++)
    {
        let path = queue[index];
        _traverse(path.node, traitNode, visit, path)
    }
}

// 处理单个node
function visitNodeSingle(parentPath: Path, key: string, node:Node, traitNode: Node, visit: VisitCallBack)
{
    // 封装成Path
    let path = new Path(node, parentPath, currentEnvironment);
    // 设置childPath
    parentPath.set(key, path);
    // 深度优先遍历，方便解析作用域
    visitQueue([path], traitNode, visit);
}

// 处理node数组
function visitNodeArray(parentPath: Path, key: string, nodeArray: Array<Node>, traitNode: Node, visit: VisitCallBack)
{
    // 把子node封装成path，入队
    let queue: Array<Path> = [];
    for (let index = 0; index < nodeArray.length; ++index)
    {
        // 封装成Path
        let path = new Path(nodeArray[index], parentPath, currentEnvironment);
        queue.push(path);
    }

    // 设置childPath
    parentPath.setArray(key, queue);

    // 深度优先遍历，方便解析作用域
    visitQueue(queue, traitNode, visit);
}

// 递归遍历树
function _traverse(node: Node, traitNode: Node, visit: VisitCallBack, path: Path | null)
{
    // 首次进来初始化一些值，最外层不设置环境
    if (null == path) 
    {
        // 头节点不设置replaceWith函数
        path = new Path(node, path, null);
        currentEnvironment = new Environment(path, null);
    }
    
    updatePath(path);
    // 调试日志
    debugLog(path);
    // 判断是否符合特征码然后加入访问队列
    if (isTraitNode(node, traitNode)) visit(path);

    // 保存来时环境
    let previousEnvironment: Environment | null = null;
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
        let childNode = node[key];
        if (!childNode || childNode.length == 0) continue;

        if (!Array.isArray(childNode)) visitNodeSingle(path, key, childNode, traitNode, visit);
        else visitNodeArray(path, key, childNode, traitNode, visit);
    }

    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment)
    {
        currentEnvironment = previousEnvironment;
        isBlockScopeEnabled = true;
    }
}

// 对外函数
function traverse(node: Node, traitNode: any, visit: VisitCallBack)
{
    if (node["type"] == 'File') node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");

    // 每次调用traverse的时候清理下缓存|初始化
    currentEnvironment = null;
    isBlockScopeEnabled = true;

    // 第一次进来时，path是null
    _traverse(node, traitNode, visit, null);
}

export {
	traverse,
};
