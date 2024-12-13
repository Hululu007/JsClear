"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameNote = void 0;
class NameNote {
    constructor(prefix = "var") {
        this.prefix = prefix;
        this.count = 0;
    }
    new() {
        this.count++;
        return this.prefix + "_" + this.count;
    }
}
exports.NameNote = NameNote;
