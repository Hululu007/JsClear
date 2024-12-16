"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
/*
expression  -> union
union:      -> complement ( ("|" complement) )*
complement  -> ( "!" ) complement | primary
primary     -> Node | "(" + expression ")";
*/
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.result = {
            union: [],
            complement: []
        };
        this.flag = true;
    }
    pick(count = 0) {
        return this.tokens[this.current + count];
    }
    advance() {
        this.current++;
    }
    isAtEnd() {
        return this.current >= this.tokens.length;
    }
    push() {
        if (this.flag) {
            this.result.union.push(this.pick().value);
        }
        else {
            this.result.complement.push(this.pick().value);
        }
    }
    expression() {
        this.union();
    }
    union() {
        this.complement();
        while (!this.isAtEnd() && this.pick().type == 1 /* TOKEN_TYPE.UNION */) {
            this.advance();
            this.complement();
        }
    }
    complement() {
        if (this.pick().type == 2 /* TOKEN_TYPE.COMPLEMENT */) {
            let flag = this.flag;
            this.flag = !this.flag;
            this.advance();
            this.complement();
            this.flag = flag;
        }
        else
            this.primary();
    }
    primary() {
        if (this.pick().type == 0 /* TOKEN_TYPE.NODE */) {
            this.push();
            this.advance();
        }
        else if (this.pick().type == 3 /* TOKEN_TYPE.LEFT_PAREN */) {
            let flag = this.flag;
            this.advance();
            this.expression();
            if (this.pick().type != 4 /* TOKEN_TYPE.RIGHT_PAREN */)
                throw new Error("缺少右括号.");
            else
                this.advance();
            this.flag = flag;
        }
    }
    getResult() {
        this.expression();
        return this.result;
    }
}
exports.Parser = Parser;
