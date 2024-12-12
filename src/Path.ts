import { node2js }  from "./generator";
import { Environment }  from "./Environment";

interface Node {
    [key: string]: any;
    type: string;
  }

class Path
{
    public node: Node;
    public type: string;
    public parentPath: Path | null;
    public environment: Environment | null;

    private childPath: any;

    constructor(node: Node, parentPath: Path | null, environment: Environment | null)
    {
        this.node = node;
        this.type = node.type;
        this.parentPath = parentPath;
        this.environment = environment;
        this.childPath = {};    // 浅拷贝
    }

    findReference()
    {
        throw new Error("非VariableDeclarator节点不能调用。");
    }

    replaceWith(node: Node)
    {
        throw new Error("这个path无可替代");
    }

    toString()
    {
        return node2js(this.node);
    }

    get(key: string)
    {
        if (this.childPath[key] == null) new Error("未解析");
        else return this.childPath[key];  
    }

    set(key: string, path: Path)
    {
        this.childPath[key] = path;
    }

    setArray(key: string, path: Array<Path>)
    {
        this.childPath[key] = path;
    }
}

export {
    Path,
    Node
}
