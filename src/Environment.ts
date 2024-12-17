import { Path } from "./Path"

class Environment
{
    static environmentTypes =  ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];
    static cache: WeakMap<Path, Environment> = new WeakMap();

    public path: Path;
    public parentEnvironment: Environment | null;
    public varPaths: Set<Path>;

    constructor(path: Path, parentEnvironment: Environment | null)
    {
        
        let cacheInstance  = Environment.cache.get(path)
        if (cacheInstance  == undefined)
        {
            this.path = path;
            this.parentEnvironment = parentEnvironment;
            this.varPaths = new Set();
            Environment.cache.set(path, this);
        }
        else
        {
            // 其实要个return就够了，这些为了不报错
            this.path = cacheInstance.path;
            this.parentEnvironment = cacheInstance.parentEnvironment;
            this.varPaths = cacheInstance.varPaths;

            return cacheInstance;
        }
    }

    clearVarPaths()
    {
        this.varPaths = new Set();
    }

    static clearCache()
    {
        Environment.cache = new WeakMap();
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