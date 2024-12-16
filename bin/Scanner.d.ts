declare const enum TOKEN_TYPE {
    NODE = 0,
    UNION = 1,
    COMPLEMENT = 2,
    LEFT_PAREN = 3,
    RIGHT_PAREN = 4
}
interface TOKEN {
    type: TOKEN_TYPE;
    value: string;
}
declare class Scanner {
    static typeChars: string[];
    previous: number;
    current: number;
    source: string;
    constructor(source: string);
    static newNot(): TOKEN;
    static newOr(): TOKEN;
    static newLeftParen(): TOKEN;
    static newRightParen(): TOKEN;
    static newNode(value: string): TOKEN;
    private pick;
    private advance;
    isLetter(char: string): boolean;
    private getNodeValue;
    getTokens(): TOKEN[];
    static getString(tokens: Array<TOKEN>): string;
}
export { Scanner, TOKEN, TOKEN_TYPE, };
