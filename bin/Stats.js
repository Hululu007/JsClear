"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
class Stats {
    constructor() {
        this.stats = {};
    }
    add(str) {
        if (typeof str != "string")
            throw ("传入类型有误");
        if (this.stats[str] == undefined)
            this.stats[str] = 1;
        else
            this.stats[str]++;
    }
    get(isCount = true) {
        if (isCount)
            return this.stats;
        else
            return Object.keys(this.stats);
    }
}
exports.Stats = Stats;
