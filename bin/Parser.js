"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.previous = 0;
        this.current = 0;
        this.stack = [];
        this.parseResult = [];
    }
    push(value) {
        this.stack.push(value);
    }
    pop() {
        return this.stack.pop();
    }
    head() {
        return this.stack[this.stack.length - 1];
    }
    // "|"
    parseOr() {
    }
    // "!"
    parseNot() {
        this.parse();
        this.push(2 /* TOEKN_TYPE.NOT */);
    }
    // "&"
    parseAnd() {
    }
    parseNode() {
        this.stack.push(this.pick().value);
        this.advance();
    }
    pick(count = 0) {
        return this.tokens[this.current + count];
    }
    advance() {
        this.current++;
        this.previous = this.current;
    }
    // 解析tokens
    parse() {
        switch (this.pick().type) {
            case 0 /* TOEKN_TYPE.NODE */:
                this.parseNode();
                break;
            case 2 /* TOEKN_TYPE.NOT */:
                this.parseNot();
                break;
            case 3 /* TOEKN_TYPE.AND */:
                this.parseAnd();
                break;
            case 1 /* TOEKN_TYPE.OR */:
                this.parseOr();
                break;
            default:
                throw new Error("未知指令.");
        }
    }
    check(type) {
        return false;
    }
}
exports.Parser = Parser;
