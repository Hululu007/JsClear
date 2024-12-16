const enum TOKEN_TYPE
{
    NODE,
    UNION,
    COMPLEMENT,
    LEFT_PAREN,
    RIGHT_PAREN
}

interface TOKEN {
    type: TOKEN_TYPE,
    value: string
}

class Scanner
{
    static typeChars = ['|', '(', ')', '!'];

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
        return { type: TOKEN_TYPE.COMPLEMENT, value: '!' };
    }

    static newOr(): TOKEN
    {
        return { type: TOKEN_TYPE.UNION, value: '|' };
    }

    static newLeftParen(): TOKEN
    {
        return { type: TOKEN_TYPE.LEFT_PAREN, value: '(' };
    }

    static newRightParen(): TOKEN
    {
        return { type: TOKEN_TYPE.RIGHT_PAREN, value: ')' };
    }


    static newNode(value: string): TOKEN
    {
        return { type: TOKEN_TYPE.NODE, value: value };
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

    static getString(tokens: Array<TOKEN>)
    {
        let str = "";
        for (let token of tokens)
        {
            str += token.value;
        }
        return str;
    }
}

export {
	Scanner,
    TOKEN,
    TOKEN_TYPE,
};