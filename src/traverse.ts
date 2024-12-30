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
    public headPath: Path;
    public headEnvironment: Environment;
    // 当前环境
    public currentEnvironment: Environment;
    // path之间以node为桥梁
    public contextOfPath: WeakMap<Node, Path>;

    // 是否重构环境
    public isRefactorEnvironment: boolean;

    constructor(headPath: Path, headEnvironment: Environment = new Environment(null))
    {
        this.headPath = headPath;
        this.headEnvironment = headEnvironment;
        this.currentEnvironment = headEnvironment;

        this.isRefactorEnvironment = false;
        this.contextOfPath = new WeakMap();
        this.contextOfPath.set(headPath.node, headPath);
        this.updatePath(headPath);
    }

    // 创建子node对应的path存进contextOfPath
    newPath(path: Path, isNewPathSetSkip: boolean)
    {
        let node = path.node;
        // 遍历子树
        const keys = VISITOR_KEYS[node["type"]];
        for (const key of keys)
        {
            let childNode = node[key];
            if (!childNode) continue;

            if (!Array.isArray(childNode)) this.visitNodeSingle(path, childNode, key, isNewPathSetSkip);
            else this.visitNodeArray(path, childNode, key, isNewPathSetSkip);
        }
    }

    // 处理node数组
    visitNodeArray(parentPath: Path, nodeArray: Array<Node>, key: string, isNewPathSetSkip: boolean)
    {
        let queue = [];
        for (let index = 0; index < nodeArray.length; ++index)
        {
            let path = this.contextOfPath.get(nodeArray[index]);
            if (path == undefined)
            {
                // 封装成Path
                path = new Path(nodeArray[index], parentPath, isNewPathSetSkip);
                // 为path增添一些方法
                this.updatePath(path);
                // 设置缓存
                this.contextOfPath.set(nodeArray[index], path);
            }

            queue.push(path);
        }

        // 深度优先遍历，方便解析作用域
        this.visitQueue(queue, key, isNewPathSetSkip);
    }

    // 处理单个node
    visitNodeSingle(parentPath: Path, node: Node, key: string, isNewPathSetSkip: boolean)
    {
        // 如果已经有了Path就不再创建了
        let path = this.contextOfPath.get(node);
        if (path == undefined)
        {
            // 封装成Path
            path = new Path(node, parentPath, isNewPathSetSkip);
            // 设置缓存
            this.contextOfPath.set(node, path);
            // 为path增添一些方法
            this.updatePath(path);
        }
    
        // 深度优先遍历，方便解析作用域
        this.visitQueue([path], key, isNewPathSetSkip);
    }

    // 深度优先
    visitQueue(queue: Array<Path>, key: string, isNewPathSetSkip: boolean)
    {
        // 保存来时环境
        let previousEnvironment: Environment;
        // 检查是否更新环境
        let isUpadeEnvironment: boolean

        for (let index = 0; index < queue.length; index++)
        {
            let path = queue[index];

            if (path.isVarNode()) this.currentEnvironment.defineVariable(path);
            if (path.type == "Identifier") 
            {
                let name = path.get("name");
                let varPath = this.currentEnvironment.findVariable(name);
                if (varPath == null) 
                {
                    log.debug("发现一个未定义就使用的变量: " + name);
                    // 未定义就使用的变量默认为全局
                    let unVarPath = this.headEnvironment.unVarPaths.get(name);
                    if (unVarPath == undefined)
                    {
                        path.referencePaths = [];
                        this.headEnvironment.unVarPaths.set(name, path);
                    }
                    else
                    {
                        unVarPath.referencePaths!.push(path);
                    }
                }
                else varPath.referencePaths!.push(path);
            }

            isUpadeEnvironment = this.isNewEnvironment(path, key);
            if (isUpadeEnvironment)
            {
                previousEnvironment = this.currentEnvironment;
                this.currentEnvironment = new Environment(previousEnvironment);    
            }

            this.newPath(path, isNewPathSetSkip);

            // 如果更新了环境，子树都遍历完时，还原环境
            if (isUpadeEnvironment)
            {
                this.currentEnvironment = previousEnvironment!;
            }
        }
    }

    // 检查是否开辟新环境
    isNewEnvironment(path: Path, key: string)
    {
        // 可以直接开辟作用域的节点
        if (Environment.environmentTypes.includes(path.type))
        {
            return true;
        }
    
        // 单个BlockStatement
        if (path.type == "BlockStatement") 
        {
            if (Environment.environmentTypes.includes(path.parentPath!.type))
            {
                return false;
            }

            if (Environment.notEnvironmentTypes.includes(path.parentPath!.type))
            {
                return false;
            }
        
            return true;
        }

        // 特殊节点-函数名与函数形参处于不同的作用域
        if (Environment.specialEnvTypes.includes(path.parentPath!.type))
        {
            if (key == "params") return true;
        }
    
        return false;
    }

    // 递归遍历树-访问path
    traverseNode(node: Node, traitNode: Node, visit: VisitPath)
    {
        
        let path = this.contextOfPath.get(node);
        if (path == undefined) throw new Error("呃....发生了一个意外的错误.");
    
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
    }

    // 为path添加一些方法
    updatePath(path: Path)
    {
        if (path.type != "Program" && path.type != "File")
        {
            this.implementPathReplaceWith(path)
        }

        this.implementPathGet(path);
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
                return t.contextOfPath.get(node);
            }
            else if (Array.isArray(node))
            {
                let pathArray = [];
                for (let n of node)
                {
                    if (isNode(n))
                    {
                        pathArray.push(t.contextOfPath.get(n));
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
            this.initReference();

            // 修正pathCache
            t.contextOfPath.delete(oldNode);
            t.contextOfPath.set(newNode, this);

            // 解析新的node，设置isSkip
            t.newPath(this, isSkip);
            
            // 重新解析环境
            t.currentEnvironment = new Environment(null);
            t.newPath(t.headPath, isSkip);
        }
    }
}

function traverse(node: Node, traitNode: Node, visit: VisitPath)
{
    if (node["type"] == "File") node = node["program"];
    if (!isNode(node)) throw new Error("非node节点");

    let headPath = new Path(node, null);
    let headEnvironment = new Environment(null);

    let t = new Traverse(headPath, headEnvironment);
    t.newPath(headPath, false);

    t.traverseNode(node, traitNode, visit);
}

export { traverse };