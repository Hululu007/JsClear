class Environment
{
    constructor(parentNode = null)
    {
        this.parentNode = parentNode;
        this.defineMap = {};
        this.assignMap = {};
    }

    define(name, node)
    {
        this.defineMap[name] = node;
    }

    assign(name, node)
    {
        if (!Array.isArray(this.assignMap[name])) this.assignMap[name] = [];
        this.assignMap[name].push(node);
    }
}



module.exports = {
    Environment
};