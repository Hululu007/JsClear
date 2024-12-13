import { TOKEN, TOEKN_TYPE }  from "./Scanner";

class Parser 
{
    public tokens: Array<TOKEN>
    public previous: number;
    public current: number;
    public parseResult: Array<string | TOEKN_TYPE>;

    private stack: Array<string | TOEKN_TYPE>;
    
    constructor(tokens: Array<TOKEN>)
    {
        this.tokens = tokens;
        this.previous = 0;
        this.current = 0;
        this.stack = [];
        this.parseResult = [];
    }

    push(value: string | TOEKN_TYPE)
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

    // "|"
    parseOr()
    {

    }

    // "!"
    parseNot()
    {
        
        this.parse();
        this.push(TOEKN_TYPE.NOT);
    }

    // "&"
    parseAnd()
    {

    }

    parseNode()
    {
        this.stack.push(this.pick().value);
        this.advance();
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
            case TOEKN_TYPE.AND:
                this.parseAnd();
                break;
            case TOEKN_TYPE.OR:
                this.parseOr();
                break;

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