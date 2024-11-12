class Environment
{
    constructor(parentNode)
    {
        this.parentNode = parentNode;
        this.map = {}
    }

    define(name, value)
    {
        this.map(name, value)
    }
}

module.exports = {
    ast2js
};