const { node2js } = require("./generator.js");

// 内部使用，查找引用
function traverse()
{

}

class Path
{
    constructor(node, parentPath, environment)
    {
        this.node = node;
        this.type = node.type;
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
        let environment = this.environment;

    }

    get(key)
    {
        return this.childPath[key];
    }

    set(key, path)
    {
        this.childPath[key] = path;
    }
}

module.exports = {
    Path
}
