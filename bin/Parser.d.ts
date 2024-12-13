import { TOKEN, TOEKN_TYPE } from "./Scanner";
declare class Parser {
    tokens: Array<TOKEN>;
    previous: number;
    current: number;
    parseResult: Array<string | TOEKN_TYPE>;
    private stack;
    constructor(tokens: Array<TOKEN>);
    push(value: string | TOEKN_TYPE): void;
    pop(): string | TOEKN_TYPE | undefined;
    head(): string | TOEKN_TYPE;
    parseOr(): void;
    parseNot(): void;
    parseAnd(): void;
    parseNode(): void;
    pick(count?: number): TOKEN;
    advance(): void;
    parse(): void;
    check(type: string): boolean;
}
export { Parser };
