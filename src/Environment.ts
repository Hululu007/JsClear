import { Path } from "./Path"

class Environment
{
    // 这些节点需要遇到就解析作用域而不是遇到其子节点的"BlockStatement"时
    static loopTypes = ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement"];
    static functionTypes = ["ArrowFunctionExpression", "FunctionDeclaration", "ObjectMethod", "ClassMethod"];
    static environmentTypes =  ["IfStatement"].concat(Environment.loopTypes).concat(Environment.functionTypes);

    public path: Path;
    public parentEnvironment: Environment | null;
    public varPaths: Set<Path>;

    constructor(path: Path, parentEnvironment: Environment | null)
    {
        
        this.path = path;
        this.parentEnvironment = parentEnvironment;
        this.varPaths = new Set();
    }

    clearVarPaths()
    {
        this.varPaths = new Set();
    }

    defineVariable(path: Path)
    {
        this.varPaths.add(path);
    }

    // 递归寻找
    findVariable(name: string): Path | null
    {
        let definePaths = this.varPaths

        for (let varPath of definePaths)
        {
            let node = varPath.node;
            if (node['name'] == name) return varPath;
        }

        if (this.parentEnvironment != null) 
        {
            return this.parentEnvironment.findVariable(name);
        }
        else return null;
    }
}

export {
    Environment
};