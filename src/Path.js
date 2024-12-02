const { node2js } = require("./generator.js");

class Path
{
    constructor(node, parentPath)
    {
        this.node = node;
        this.parentPath = parentPath;
        this.type = node.type;
    }

    toString()
    {
        return node2js(this.node);
    }
}

module.exports = {
    Path
}