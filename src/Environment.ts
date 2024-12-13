import { Path } from "./Path"

class Environment
{
    static environmentTypes =  ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];
    static cache: WeakMap<Path, Environment> = new WeakMap();

    public path: Path;
    public parentEnvironment: Environment | null;
    public definePaths: Array<Path> | null;

    constructor(path: Path, parentEnvironment: Environment | null)
    {
        
        let cacheInstance  = Environment.cache.get(path)
        if (cacheInstance  == undefined)
        {
            this.path = path;
            this.parentEnvironment = parentEnvironment;
            this.definePaths = null;
            Environment.cache.set(path, this);
        }
        else
        {
            // 其实要个return就够了，这些为了不报错
            this.path = cacheInstance.path;
            this.parentEnvironment = cacheInstance.parentEnvironment;
            this.definePaths = cacheInstance.definePaths;

            return cacheInstance;
        }
    }

    clearCache()
    {
        Environment.cache = new WeakMap();
    }

    defineVariable(path: Path)
    {
        if (this.definePaths == null)
        {
            this.definePaths = [];
        }
        this.definePaths.push(path);
    }

    findVariable(name: string): Path | null
    {
        let definePaths = this.definePaths
        if (definePaths == null) return null;

        for (let i = definePaths.length - 1; i >= 0; --i)
        {
            let node = definePaths[i].node;
            if (node['id']['name'] == name) return definePaths[i];
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