import { TOKEN } from "./Scanner";
interface ParserResult {
    union: Array<string>;
    complement: Array<string>;
}
declare class Parser {
    private tokens;
    private current;
    private result;
    private flag;
    constructor(tokens: Array<TOKEN>);
    private pick;
    private advance;
    private isAtEnd;
    private push;
    private expression;
    private union;
    private complement;
    private primary;
    getResult(): ParserResult;
}
export { Parser, ParserResult };
