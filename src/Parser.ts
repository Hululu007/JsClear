import { Scanner, TOKEN, TOKEN_TYPE } from "./Scanner"

interface ParserResult
{
    union: Array<string>,
    complement: Array<string>,
}

/*
expression  -> union
union:      -> complement ( ("|" complement) )*
complement  -> ( "!" ) complement | primary
primary     -> Node | "(" + expression ")";
*/

class Parser
{
    private tokens: Array<TOKEN>;
    private current: number;
    private result: ParserResult;
    private flag: boolean;

    constructor(tokens: Array<TOKEN>)
    {
        this.tokens = tokens;
        this.current = 0;
        this.result = {
            union: [],
            complement: []
        }
        this.flag = true;
    }

    private pick(count=0)
    {
        return this.tokens[this.current+count];
    }

    private advance()
    {
        this.current++;
    }

    private isAtEnd()
    {
        return this.current >= this.tokens.length;
    }

    private push()
    {
        if (this.flag)
        {
            this.result.union.push(this.pick().value);
        }
        else
        {
            this.result.complement.push(this.pick().value);
        }
    }

    private expression()
    {
        this.union();
    }

    private union()
    {
        this.complement();
        while (!this.isAtEnd() && this.pick().type == TOKEN_TYPE.UNION)
        {
            this.advance();
            this.complement();
        }

    }

    private complement()
    {
        if (this.pick().type == TOKEN_TYPE.COMPLEMENT)
        {
            let flag = this.flag;
            this.flag = !this.flag;
            this.advance();
            this.complement();
            this.flag = flag;
        }
        else this.primary();
    }

    private primary()
    {
        if (this.pick().type == TOKEN_TYPE.NODE)
        {
            this.push();
            this.advance();
        }
        else if (this.pick().type == TOKEN_TYPE.LEFT_PAREN)
        {
            let flag = this.flag;
            this.advance();
            this.expression();
            if (this.pick().type != TOKEN_TYPE.RIGHT_PAREN) throw new Error("缺少右括号.");
            else this.advance();
            this.flag = flag;
        }
    }

    getResult()
    {
        this.expression();
        return this.result;
    }
}

export { Parser, ParserResult };