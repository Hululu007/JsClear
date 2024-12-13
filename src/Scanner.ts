const enum TOEKN_TYPE
{
    NODE,
    OR,
    NOT,
    AND,
}

interface TOKEN {
    type: TOEKN_TYPE,
    value: string
}

class Scanner
{
    public previous;
    public current;
    public source;

    constructor(source: string)
    {
        this.source = source;
        this.current = 0;
        this.previous = 0;
    }

    static newNot(): TOKEN
    {
        return { type: TOEKN_TYPE.NOT, value: '!' };
    }

    static newOr(): TOKEN
    {
        return { type: TOEKN_TYPE.OR, value: '|' };
    }

    static newAnd(): TOKEN
    {
        return { type: TOEKN_TYPE.AND, value: '&' };
    }

    static newNode(value: string): TOKEN
    {
        return { type: TOEKN_TYPE.NODE, value: value };
    }

    private pick(count=0)
    {
        return this.source[this.current + count];
    }

    private advance()
    {
        this.current++;
        this.previous = this.current;
    }

    isLetter(char: string) {
        return /^[A-Za-z]$/.test(char);
    }

    private getNodeValue()
    {
        while (this.current < this.source.length)
        {
            if (this.isLetter(this.pick()))
            {
                this.current++;
            }
            else
            {
                return this.source.slice(this.previous, this.current);
            }
        }

        return this.source.slice(this.previous);
    }

    getTokens()
    {
        let tokens: Array<TOKEN> = [];
        this.current = 0;
        this.previous = 0;

        while (this.current < this.source.length)
        {
            let c = this.pick();
            switch(c)
            {
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

export {
	Scanner,
    TOKEN,
    TOEKN_TYPE,
};