"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
class Scanner {
    constructor(source) {
        this.source = source;
        this.current = 0;
        this.previous = 0;
    }
    static newNot() {
        return { type: 2 /* TOEKN_TYPE.NOT */, value: '!' };
    }
    static newOr() {
        return { type: 1 /* TOEKN_TYPE.OR */, value: '|' };
    }
    static newAnd() {
        return { type: 3 /* TOEKN_TYPE.AND */, value: '&' };
    }
    static newNode(value) {
        return { type: 0 /* TOEKN_TYPE.NODE */, value: value };
    }
    pick(count = 0) {
        return this.source[this.current + count];
    }
    advance() {
        this.current++;
        this.previous = this.current;
    }
    isLetter(char) {
        return /^[A-Za-z]$/.test(char);
    }
    getNodeValue() {
        while (this.current < this.source.length) {
            if (this.isLetter(this.pick())) {
                this.current++;
            }
            else {
                return this.source.slice(this.previous, this.current);
            }
        }
        return this.source.slice(this.previous);
    }
    getTokens() {
        let tokens = [];
        this.current = 0;
        this.previous = 0;
        while (this.current < this.source.length) {
            let c = this.pick();
            switch (c) {
                case '!':
                    {
                        tokens.push(Scanner.newNot());
                        this.advance();
                        break;
                    }
                case '&':
                    {
                        tokens.push(Scanner.newAnd());
                        this.advance();
                        break;
                    }
                case '|':
                    {
                        tokens.push(Scanner.newOr());
                        this.advance();
                        break;
                    }
                case ' ':
                case '\r':
                case '\n':
                    this.advance();
                    break;
                default:
                    {
                        let value = this.getNodeValue();
                        tokens.push(Scanner.newNode(value));
                        this.previous = this.current;
                    }
            }
        }
        return tokens;
    }
}
exports.Scanner = Scanner;
