class Environment
{
    constructor(path, parentEnvironment=null)
    {
        this.childEnvironment = [];
        this.variable = {};
        this.path = path;
        this.parentEnvironment = parentEnvironment;
    }

    defineVariable(name, path)
    {
        this.variable[name] = path;
    }

    defineChildEnvironment(environment)
    {
        this.childEnvironment.push(environment)
    }

    findVariable(target)
    {
        const path = this.path;
        while (path != null)
        {
            const names = Object.keys(path.variable);
            for (const name of names)
            {
                if (name == target) return { "parentPath": path, "variablePath": path.variable[name] }
            }
            path = path.parentEnvironment;
        }

        return null;
    }

    findReference(target)
    {
        let location = findVariable(target);
        if (location != null)
        {
            let { parentPath, variablePath } = location;
            
        }
    }
}

module.exports = {
    Environment
};