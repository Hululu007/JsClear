class Environment
{
    constructor(parentNode = null)
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
    Environment
};