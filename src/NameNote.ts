class NameNote
{
    private prefix: string;
    private count: number;

    constructor(prefix="var")
    {
        this.prefix = prefix;
        this.count = 0;
    }

    new()
    {
        this.count++;
        return this.prefix + "_" +this.count;
    }
}

export {
    NameNote
}