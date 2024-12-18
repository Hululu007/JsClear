import { isNode }  from "./utiles";
import { Path, Node }  from "./Path";
import { VISITOR_KEYS }  from "@babel/types";
import { isTraitNode }  from "./traitNode";
import { Log }  from "./Log";
import { Environment }  from "./Environment";

type VisitPath = (path: Path) => void;

// 调试日志开关
let log = new Log(false);
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

class Traverse
{
    public currentEnvironment: Environment;
    // path与node之间的桥梁
    public context: WeakMap<Node, Path>

    constructor(headEnvironment: Environment)
    {
        this.currentEnvironment = headEnvironment;
        this.context = new WeakMap();
    }

    // 创建子node对应的path存进context
    newPath(path: Path, isNewPathSetSkip: boolean)
    {
        // 保存来时环境
        let previousEnvironment: Environment;
        // 检查是否更新环境
        let isUpadeEnvironment = false;
        if (this.isNewEnvironment(path))
        {
            isUpadeEnvironment = true;
            previousEnvironment = this.currentEnvironment;
            // 做了缓存机制，相同的path对象对应相同的Environment
            this.currentEnvironment = new Environment(path, previousEnvironment);    
        }

        // 为path增添一些方法
        this.updatePath(path);

        let node = path.node;
        // 遍历子树
        const keys = VISITOR_KEYS[node["type"]];
        for (const key of keys)
        {
            let childNode = node[key];
            if (!childNode) continue;

            if (!Array.isArray(childNode)) this.visitNodeSingle(path, childNode, isNewPathSetSkip);
            else this.visitNodeArray(path, childNode, isNewPathSetSkip);
        }

        // 如果更新了环境，子树都遍历完时，还原环境
        if (isUpadeEnvironment)
        {
            this.currentEnvironment = previousEnvironment!;
        }

    }

    // 处理node数组
    visitNodeArray(parentPath: Path, nodeArray: Array<Node>, isNewPathSetSkip: boolean)
    {
        let queue = [];
        for (let index = 0; index < nodeArray.length; ++index)
        {
            let path = this.context.get(nodeArray[index]);
            if (path == undefined)
            {
                // 封装成Path
                path = new Path(nodeArray[index], parentPath, this.currentEnvironment, isNewPathSetSkip);
                // 设置缓存
                this.context.set(nodeArray[index], path);
            }

            queue.push(path);
        }

        // 深度优先遍历，方便解析作用域
        this.visitQueue(queue, isNewPathSetSkip);
    }

    // 处理单个node
    visitNodeSingle(parentPath: Path, node: Node, isNewPathSetSkip: boolean)
    {
        // 如果已经有了Path就不再创建了
        let path = this.context.get(node);
        if (path == undefined)
        {
            // 封装成Path
            path = new Path(node, parentPath, this.currentEnvironment, isNewPathSetSkip);
            // 设置缓存
            this.context.set(node, path);
        }
    
        // 深度优先遍历，方便解析作用域
        this.visitQueue([path], isNewPathSetSkip);
    }

    // 深度优先
    visitQueue(queue: Array<Path>, isNewPathSetSkip: boolean)
    {
        for (let index = 0; index < queue.length; index++)
        {
            let path = queue[index];
            this.newPath(path, isNewPathSetSkip);
        }
    }

    // 检查是否开辟新环境
    isNewEnvironment(path: Path)
    {
        let type = path.type
    
        if (Environment.environmentTypes.includes(type))
        {
            return true;
        }
    
        // 单个BlockStatement
        if (type == "BlockStatement") 
        {
            if (Environment.environmentTypes.includes(path.parentPath!.type))
            {
                return false;
            }
            return true;
        }
    
        return false;
    }

    // 递归遍历树-访问path
    traverseNode(node: Node, traitNode: Node, visit: VisitPath)
    {
        
        let path = this.context.get(node);
        if (path == undefined) throw new Error("呃....发生了一个意外的错误.");

        // 保存来时环境
        let previousEnvironment: Environment;
        // 检查是否更新环境
        let isUpadeEnvironment = false;
        if (this.isNewEnvironment(path))
        {
            isUpadeEnvironment = true;
            previousEnvironment = this.currentEnvironment;
            // 做了缓存机制，相同的path对象对应相同的Environment
            this.currentEnvironment = new Environment(path, previousEnvironment);    
        }
    
        // 调试日志
        debugLog(path);
        // 判断是否符合特征码然后访问
        if (isTraitNode(node, traitNode) && path.isSkip == false) 
        {
            visit(path);
        }
    
        const keys = VISITOR_KEYS[node["type"]];
        for (const key of keys)
        {
            let childNode = node[key];
            if (!childNode) continue;
    
            if (!Array.isArray(childNode)) 
            {
                this.traverseNode(childNode, traitNode, visit);
            }
            else
            {
                for (let n of childNode)
                {
                    if (n == null) continue;
                    this.traverseNode(n, traitNode, visit);
                }
            }
        }

        // 如果更新了环境，子树都遍历完时，还原环境
        if (isUpadeEnvironment)
        {
            this.currentEnvironment = previousEnvironment!;
        }
    }

    // 为path添加一些方法
    updatePath(path: Path)
    {
        let type = path.type
        if (type == 'VariableDeclarator')
        {
            this.implementPathFindReference(path)
        }

        if (type != "Program" && type != "File")
        {
            this.implementPathReplaceWith(path)
        }

        this.implementPathGet(path);
    }

    // path.findReference 
    implementPathFindReference(path: Path)
    {
        let t = this;
        path.findReference = function()
        {
            let targetName = this.node["id"]["name"];
            let environment = this.environment as Environment;
            // 清除上次残留，防止path.replaceWith后发生错误
            environment.clearVarPaths();

            // 每次都从当前环境重新解析
            function updateEnvDefineVar(path: Path)
            {
                if (path.type == "VariableDeclarator")
                {
                    // 清除上次残留，防止path.replaceWith后发生错误
                    path.clearReference();
                    t.currentEnvironment.defineVariable(path);
                }
                else if (path.type == "Identifier" && path.parentPath!.type != "VariableDeclarator")
                {
                    let name = path.node["name"];
                    // 减少一点回溯，提升性能
                    if (name == targetName) 
                    {
                        let varPath = t.currentEnvironment.findVariable(name);
                        if (varPath != null)
                        {
                            varPath.addReference(path);
                        }
                    }
                }
            }

            t.currentEnvironment = environment;
            t.traverseNode(environment.path.node, { type: "*" }, updateEnvDefineVar);
            return this.getReferencePaths();
        }
    }

    // path.get
    implementPathGet(path: Path)
    {
        let t = this;
        path.get = function(key: string)
        {
            let node = this.node[key];
            if (isNode(node))
            {
                return t.context.get(node);
            }
            else if (Array.isArray(node))
            {
                let pathArray = [];
                for (let n of node)
                {
                    if (isNode(n))
                    {
                        pathArray.push(t.context.get(n));
                    }
                    else
                    {
                        pathArray.push(n);
                    }
                }
                return pathArray;
            }
            else return node;
        }
    }

    // path.replaceWith
    implementPathReplaceWith(path: Path)
    {
        let t = this;
        // 闭包可能捕获不到
        let KEYS = VISITOR_KEYS;
        path.replaceWith = function(newNode: Node, isSkip: boolean)
        {
            if (typeof isSkip != "boolean") throw new Error("需要传入一个bool值，决定是否跳过替换内容");

            let parentPath = this.parentPath;
            let parentNode = this.parentPath!.node;
            let oldNode = this.node;

            // 修正parentNode
            const keys = KEYS[parentPath!.type];
            for (const key of keys)
            {
                let node = parentNode[key];
                if (!node) continue;

                if (Array.isArray(node))
                {
                    let index = 0;
                    for (; index < node.length; index++)
                    {
                        if (node[index] == oldNode) break;
                    }

                    parentNode[key][index] = newNode;
                    break;
                }
                else
                {
                    if (node == oldNode)
                    {
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
            t.context.delete(oldNode);
            t.context.set(newNode, this);

            // 解析新的node
            t.currentEnvironment = this.environment!;
            t.newPath(this, isSkip);
        }
    }
}

function traverse(node: Node, traitNode: Node, visit: VisitPath)
{
    if (node["type"] == "File") node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");

    let headPath = new Path(node, null, null);
    let headEnvironment = new Environment(headPath, null);
    headPath.environment = headEnvironment;

    let t = new Traverse(headEnvironment);
    t.context.set(node, headPath);

    t.newPath(headPath, false);
    t.traverseNode(node, traitNode, visit);
}

export { traverse };