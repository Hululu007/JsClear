class Stats
{
    private stats: { [key: string]: number };
    constructor()
    {
        this.stats = {};
    }

    add(str: string): void
    {
        if (typeof str != "string") throw("传入类型有误");
    
        if (this.stats[str] == undefined) this.stats[str] = 1;
        else this.stats[str]++;
    }

    get(isCount=true)
    {
        if (isCount) return this.stats;
        else return Object.keys(this.stats)
    }
}

export {
    Stats,
};