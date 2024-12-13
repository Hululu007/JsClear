import { TOKEN, TOEKN_TYPE }  from "./Scanner";

interface ParserResult
{
    capture: Array<string>,
    uncaught: Array<string>
}

class Parser 
{
    public tokens: Array<TOKEN>
    public previous: number;
    public current: number;
    public parseResult: ParserResult;

    private stack: Array<string | boolean>;
    
    constructor(tokens: Array<TOKEN>)
    {
        this.tokens = tokens;
        this.previous = 0;
        this.current = 0;
        this.stack = [];
        this.parseResult = { capture:[], uncaught: []};
    }

    push(value: string | boolean)
    {
        this.stack.push(value);
    }

    pop()
    {
        return this.stack.pop();
    }

    head()
    {
        return this.stack[this.stack.length - 1];
    }

    // "("
    parseLeftParen()
    {

    }

    // ")"
    parseRightParen()
    {

    }

    // "|"
    parseOr()
    {
        
    }

    // "!"
    parseNot()
    {
        this.push(false);
        this.advance();
        this.parse();
    }

    parseNode()
    {
        this.stack.push(this.pick().value);
        this.advance();
        this.parse();
    }

    pick(count=0)
    {
        return this.tokens[this.current + count];
    }

    advance()
    {
        this.current++;
        this.previous = this.current;
    }

    // 解析tokens
    parse()
    {
        switch(this.pick().type)
        {
            case TOEKN_TYPE.NODE:
                this.parseNode();
                break;
            case TOEKN_TYPE.NOT:
                this.parseNot();
                break;
            case TOEKN_TYPE.OR:
                this.parseOr();
                break;
            case TOEKN_TYPE.LEFT_PAREN:

            default:
                throw new Error("未知指令.");
        }
    }   

    check(type: string): boolean
    {
        return false;
    }
}

export { Parser };