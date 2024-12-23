import { Environment } from "./Environment";
import { node2js }  from "./generator";
import { isTraitNode } from "./traitNode";
import { isNode } from "./utiles";

interface Node {
    [key: string]: any;
    type: string;
  }

class Path
{
    public node: Node;
    public type: string;
    public parentPath: Path | null;
    public isSkip: boolean;
    public environment: Environment | null;

    public referencePaths: Array<Path> | undefined;

    constructor(node: Node, parentPath: Path | null, environment: Environment | null, isSkip=false)
    {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.environment = environment;

        this.initReference();
    }

    // api

    toString()
    {
        return node2js(this.node);
    }

    isTraitNode(traitNode: Node)
    {
        if (!isNode(traitNode)) throw new Error("需要传入一个node.");
        return isTraitNode(this.node, traitNode);
    }
    
    replaceWith(node: Node, isSkip: boolean)
    {
        throw new Error("这个path无可替代");
    }

    get(key: string): Path | any
    {
        throw new Error("呃...非常抱歉，这好像是一个bug.");
    }

    findReference()
    {
        throw new Error("这个节点不能调用.");
    }

    // 判断是否是定义path
    isVarNode()
    {
        if ("Identifier" != this.type) return false;

        let type  = this.parentPath!.type;
        if ('VariableDeclarator' == type) return true;
        if (Environment.functionTypes.includes(type)) return true;
        return false;
    }

    // 辅助函数

    initReference()
    {
        if (this.isVarNode())
        {
            this.referencePaths = [];
        }
        else
        {
            this.referencePaths = undefined;
        }
    }

}

export {
    Path,
    Node
}
