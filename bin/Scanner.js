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
        return { type: 2 /* TOKEN_TYPE.COMPLEMENT */, value: '!' };
    }
    static newOr() {
        return { type: 1 /* TOKEN_TYPE.UNION */, value: '|' };
    }
    static newLeftParen() {
        return { type: 3 /* TOKEN_TYPE.LEFT_PAREN */, value: '(' };
    }
    static newRightParen() {
        return { type: 4 /* TOKEN_TYPE.RIGHT_PAREN */, value: ')' };
    }
    static newNode(value) {
        return { type: 0 /* TOKEN_TYPE.NODE */, value: value };
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
                case '|':
                    {
                        tokens.push(Scanner.newOr());
                        this.advance();
                        break;
                    }
                case '(':
                    {
                        tokens.push(Scanner.newLeftParen());
                        this.advance();
                        break;
                    }
                case ')':
                    {
                        tokens.push(Scanner.newRightParen());
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
    static getString(tokens) {
        let str = "";
        for (let token of tokens) {
            str += token.value;
        }
        return str;
    }
}
exports.Scanner = Scanner;
Scanner.typeChars = ['|', '(', ')', '!'];
