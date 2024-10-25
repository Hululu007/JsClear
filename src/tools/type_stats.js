class TypeStats
{
    constructor()
    {
        this.isCount = isCount;
        this.stats = {};
    }

    add(str)
    {
        if (typeof str != "string") throw("传入类型有误");

        if (this.stats[str] == undefined) this.stats[str] = 1;
        else this.stats[str]++;
    }

    get(isCount=false)
    {
        if (isCount) return this.stats;
        else return Object.keys(this.stats)
    }
}

module.exports = {
    TypeStats,
};