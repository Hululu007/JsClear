import { Path } from "./Path"

class Environment
{
    static environmentTypes =  ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];

    public path: Path;
    public parentEnvironment: Environment | null;
    public definePaths: Array<Path>;

    constructor(path: Path, parentEnvironment: Environment | null)
    {
        this.path = path;
        this.parentEnvironment = parentEnvironment;
        this.definePaths = [];
    }

    defineVariable(path: Path)
    {
        this.definePaths.push(path);
    }

    findVariable(name: string): Path | null
    {
        let definePaths = this.definePaths
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