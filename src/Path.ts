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
    // 可直接确定为定义变量的节点
    static varTypes = [
        "FunctionDeclaration", , "ClassMethod", "ArrowFunctionExpression", "FunctionExpression",
        "VariableDeclarator"
    ];
    // 需要单独处理的节点
    // static specialVarTypes = ["ObjectProperty", "ObjectMethod"];

    public node: Node;
    public type: string;
    public parentPath: Path | null;
    public isSkip: boolean;


    public referencePaths: Array<Path> | undefined;

    constructor(node: Node, parentPath: Path | null, isSkip=false)
    {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;

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
        if (this.type != "Identifier") throw new Error("非Identifier节点不能调用这个方法.")
        return this.referencePaths!;
    }

    // 判断是否是定义path
    isVarNode()
    {
        if ("Identifier" != this.type) return false;

        let parentType  = this.parentPath!.type;
        // ObjectProperty 特殊处理
        if (Path.varTypes.includes(parentType)) return true;

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
