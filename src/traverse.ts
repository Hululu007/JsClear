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
let currentEnvironment: Environment;
// 块作用域是否启用
let isBlockScopeEnabled: boolean;

let currentPath: Path;

// 声明
type VisitCallBack = (path: Path) => void;
type DealWithPath = (path: Path, traitNode: Node, visit: VisitCallBack) => void;

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

// path.findReference 
function implementPathFindReference(path: Path, traitNode: Node, visit: VisitCallBack)
{
    path.findReference = function()
    {
        // 每次都从当前环境重新解析
        function updateEnvDefineVar(path: Path, traitNode: Node, visit: VisitCallBack)
        {
            if (path.type == "VariableDeclarator")
            {
                // 清除上次缓存
                path.clearReference();
                currentEnvironment.defineVariable(path);
            }
            else if (path.type == "Identifier" && path.parentPath!.type != "VariableDeclarator")
            {
                let name = path.node["name"];
                let varPath = currentEnvironment.findVariable(name);
                if (varPath != null)
                {
                    varPath.addReference(path);
                }
            }
        }
        _traverse(currentEnvironment.path, traitNode, visit, updateEnvDefineVar, false);

        // 解析后置空
        currentEnvironment.definePaths = null;

        return this.getReferencePaths();
    }
}

// path.replaceWith
function implementPathReplaceWith(path: Path, traitNode: Node, visit: VisitCallBack)
{
    path.replaceWith = function(newNode: Node, isSkip: boolean)
    {
        if (!isNode(newNode)) throw new Error("需要传入一个node.");
        if (typeof isSkip != "boolean") throw new Error("第二个参数isSkip必须是一个布尔值.");

        let parentPath = this.parentPath!;
        this.node = newNode;
        this.type = newNode.type;
        this.isSkip = isSkip;
        this.clearChildPath();
        this.clearReference();

        // 修复父node和父path
        let keys = VISITOR_KEYS[parentPath.type];
        for (let key of keys)
        {
            let childPath = parentPath.get(key);

            if (childPath == undefined) continue;
            else if (Array.isArray(childPath))
            {
                let index;
                for (index = 0; index < childPath.length; index++)
                {
                    if (childPath[index].node == newNode)
                    {
                        parentPath.node[key][index] = newNode;
                        childPath[index] = this;
                        parentPath.setArray(key, childPath);
                    }
                }
            }
            else
            {
                if (childPath.node == newNode)
                {
                    parentPath.node[key] = newNode;
                    parentPath.set(key, this);
                }
            }
        }

        if (currentPath != this) throw new Error("不是当前节点不能替换，不可以改变历史");
        _traverse(this, { type: "ovo" }, ()=>{}, ()=>{}, isSkip);
    }
}

// 为path添加一些方法
function updatePath(path: Path, traitNode: Node, visit: VisitCallBack)
{
    let type = path.type
    if (type == 'VariableDeclarator')
    {
        implementPathFindReference(path, traitNode, visit)
    }

    if (type != "Program" && type != "File")
    {
        implementPathReplaceWith(path, traitNode, visit)
    }
}

// 访问
function visitPath(path: Path, traitNode: Node, visit: VisitCallBack)
{
    let node: Node = path.node;

    // 调试日志
    debugLog(path);

    // 判断是否符合特征码然后访问
    if (isTraitNode(node, traitNode) && path.isSkip == false) 
    {
        updatePath(path, traitNode, visit);
        visit(path);
    }
}

// 深度优先
function visitQueue(queue: Array<Path>, traitNode: Node, visit: VisitCallBack, dealWithPath: DealWithPath, isNewPathSetSkip: boolean)
{
    for (let index = 0; index < queue.length; index++)
    {
        let path = queue[index];
        _traverse(path, traitNode, visit, dealWithPath, isNewPathSetSkip);
    }
}

// 处理单个node
function visitNodeSingle(parentPath: Path, key: string, node:Node, traitNode: Node, visit: VisitCallBack, dealWithPath: DealWithPath, isNewPathSetSkip: boolean)
{
    // 如果已经有了Path就不再创建了
    let path = parentPath.get(key);
    if (path == undefined)
    {
        // 封装成Path
        path = new Path(node, parentPath, isNewPathSetSkip);
        // 设置childPath
        parentPath.set(key, path);
    }

    // 深度优先遍历，方便解析作用域
    visitQueue([path], traitNode, visit, dealWithPath, isNewPathSetSkip);
}

// 处理node数组
function visitNodeArray(parentPath: Path, key: string, nodeArray: Array<Node>, traitNode: Node, visit: VisitCallBack, dealWithPath: DealWithPath, isNewPathSetSkip: boolean)
{
    // 如果已经有了queue就不再创建了
    let queue: Array<Path> = parentPath.get(key);
    if (undefined == queue)
    {
        // 把子node封装成path，入队
        queue = [];
        for (let index = 0; index < nodeArray.length; ++index)
        {
            // 封装成Path
            let path = new Path(nodeArray[index], parentPath, isNewPathSetSkip);
            queue.push(path);
        }

        // 设置childPath
        parentPath.setArray(key, queue);
    }

    // 深度优先遍历，方便解析作用域
    visitQueue(queue, traitNode, visit, dealWithPath, isNewPathSetSkip);
}

// 递归遍历树
function _traverse(path: Path, traitNode: Node, visit: VisitCallBack, dealWithPath: DealWithPath, isNewPathSetSkip: boolean)
{
    let node = path.node;

    // 遍历到的每个Path在这里处理
    currentPath = path;
    dealWithPath(path, traitNode, visit);

    // 保存来时环境
    let previousEnvironment: Environment;
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

        if (!Array.isArray(childNode)) visitNodeSingle(path, key, childNode, traitNode, visit, dealWithPath, isNewPathSetSkip);
        else visitNodeArray(path, key, childNode, traitNode, visit, dealWithPath, isNewPathSetSkip);
    }

    // 如果更新了环境，子树都遍历完时，还原环境
    if (isUpadeEnvironment)
    {
        currentEnvironment = previousEnvironment!;
        isBlockScopeEnabled = true;
    }
}

// 对外函数
function traverse(node: Node, traitNode: any, visit: VisitCallBack)
{
    if (node["type"] == 'File') node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");

    // 初始化
    let path = new Path(node, null);
    currentEnvironment = new Environment(path, null);;
    isBlockScopeEnabled = true;
    
    _traverse(path, traitNode, visit, visitPath, false);
}

export {
	traverse,
    _traverse,
};

