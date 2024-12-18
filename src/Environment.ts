import { Path } from "./Path"

class Environment
{
    static environmentTypes =  ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];

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

    findVariable(name: string): Path | null
    {
        let definePaths = this.varPaths

        for (let varPath of definePaths)
        {
            let node = varPath.node;
            if (node['id']['name'] == name) return varPath;
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