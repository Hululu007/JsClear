import { Environment } from "./Environment";
import { node2js }  from "./generator";
import { VISITOR_KEYS }  from "@babel/types";

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

    private referencePaths: Array<Path> | undefined;

    constructor(node: Node, parentPath: Path | null, environment: Environment | null, isSkip=false)
    {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;
        this.environment = environment;
    }

    toString()
    {
        return node2js(this.node);
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
        throw new Error("非VariableDeclarator节点不能调用.");
    }

    addReference(path: Path)
    {
        if (this.type != "VariableDeclarator") throw new Error("非VariableDeclarator节点不能调用.");
        if (this.referencePaths == undefined)
        {
            this.referencePaths = [];
        }
        this.referencePaths.push(path);
    }

    clearReference()
    {
        if (this.type == "VariableDeclarator")
        {
            this.referencePaths = [];
        }
        else
        {
            this.referencePaths = undefined;
        }
    }

    getReferencePaths()
    {
        if (this.type != "VariableDeclarator") throw new Error("非VariableDeclarator节点不能调用.");
        return this.referencePaths;
    }
}

export {
    Path,
    Node
}
