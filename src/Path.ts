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

    private referencePaths: Array<Path> | undefined;
    private childPath: any;

    static copy(from: Path, to: Path)
    {
        to.node = from.node;
        to.type = from.type;
        to.parentPath = from.parentPath;
        to.isSkip = from.isSkip;

        if (from.type == "VariableDeclarator")
        {
            to.setReferencePaths(from.getReferencePaths()!);
        }
        
        let keys = VISITOR_KEYS[from.type];
        for (let key of keys)
        {
            let childPath = from.get(key);

            if (childPath == undefined) continue;
            else if (Array.isArray(childPath))
            {
                to.setArray(key, childPath);
            }
            else
            {
                to.set(key, childPath);
            }
        }
    }

    constructor(node: Node, parentPath: Path | null, isSkip=false)
    {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.isSkip = isSkip;

        this.referencePaths = undefined;
        this.childPath = {};    // 浅拷贝
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
        return this.referencePaths;
    }

    setReferencePaths(referencePaths: Array<Path>)
    {
        if (this.type != "VariableDeclarator") throw new Error("非VariableDeclarator节点不能调用.");
        this.referencePaths = referencePaths;
    }

    findReference()
    {
        throw new Error("非VariableDeclarator节点不能调用.");
    }

    replaceWith(node: Node, isSkip: boolean)
    {
        throw new Error("这个path无可替代");
    }

    toString()
    {
        return node2js(this.node);
    }

    get(key: string)
    {
        return this.childPath[key];
    }

    set(key: string, path: Path)
    {
        this.childPath[key] = path;
    }

    setArray(key: string, path: Array<Path>)
    {
        this.childPath[key] = path;
    }

    clearChildPath()
    {
        this.childPath = [];
    }
}

export {
    Path,
    Node
}
