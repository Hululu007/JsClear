class Environment
{
    constructor(path, parentEnvironment)
    {
        this.path = path;
        this.parentEnvironment = parentEnvironment;
        this.definePaths = [];
    }

    defineVariable(path)
    {
        this.definePaths.push(path);
    }

    findVariable(name)
    {
        let definePaths = this.definePaths
        for (let i = definePaths.length - 1; i >= 0; --i)
        {
            let node = definePaths[i].node;
            if (node['id']['name'] == name) return definePaths[i];
        }

        if (this.parentEnvironment != null) 
        {
            return this.parentEnvironment.findVariable(name)
        }
        else null;
    }
}

let environmentTypes = ["ForStatement", "WhileStatement", "ForOfStatement", "DoWhileStatement", "IfStatement"];

module.exports = {
    Environment,
    environmentTypes
};