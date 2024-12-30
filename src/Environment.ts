import { Path } from "./Path"

class Environment
{
    // 环境
    // 这些节点需要遇到就解析作用域而不是遇到其子节点的"BlockStatement"时
    static environmentTypes =  [
        "IfStatement", "ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "ArrowFunctionExpression",
        "FunctionExpression"
    ]
    // 其子节点有"BlockStatement"也不需要new新环境
    static notEnvironmentTypes = ["TryStatement", "CatchClause"];
    // 需要单独处理的节点
    static specialEnvTypes = ["FunctionDeclaration", "ObjectMethod", "ClassMethod"];



    public parentEnvironment: Environment | null;
    public varPaths: Set<Path>;
    public unVarPaths: Map<string, Path>;

    constructor(parentEnvironment: Environment | null)
    {
        this.parentEnvironment = parentEnvironment;
        this.varPaths = new Set();
        this.unVarPaths = new Map();
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