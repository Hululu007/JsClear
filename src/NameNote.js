class NameNote
{
    constructor(prefix)
    {
        this.prefix = prefix;
        this.count = 0;
    }

    new()
    {
        this.count++;
        return this.prefix + this.count;
    }
}

module.exports = {
    NameNote
}