const { node2js } = require("./generator.js");

class Path
{
    constructor(node, parentPath, environment)
    {
        this.node = node;
        this.type = node.type;
        if (node.type == 'VariableDeclarator')
        {
            this.references = [];
        }
        this.parentPath = parentPath;
        this.environment = environment;
        this.childPath = {};    // 浅拷贝
    }

    toString()
    {
        return node2js(this.node);
    }

    // 仅仅做一些检查，逻辑在traverse.js中实现
    findReference()
    {
        if ("VariableDeclarator" != this.type) throw new Error("非VariableDeclarator节点不能查询引用");
        else return this.references;
    }

    defineReference(path)
    {
        if ("VariableDeclarator" != this.type) throw new Error("非VariableDeclarator节点不能定义引用");
        this.references.push(path)
        return true;
    }

    get(key)
    {
        if (this.childPath[key] == null) new Error("未解析");
        else return this.childPath[key];  
    }

    set(key, path)
    {
        this.childPath[key] = path;
    }
}

module.exports = {
    Path
}
