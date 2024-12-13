declare const enum TOEKN_TYPE {
    NODE = 0,
    OR = 1,
    NOT = 2,
    AND = 3
}
interface TOKEN {
    type: TOEKN_TYPE;
    value: string;
}
declare class Scanner {
    previous: number;
    current: number;
    source: string;
    constructor(source: string);
    static newNot(): TOKEN;
    static newOr(): TOKEN;
    static newAnd(): TOKEN;
    static newNode(value: string): TOKEN;
    private pick;
    private advance;
    isLetter(char: string): boolean;
    private getNodeValue;
    getTokens(): TOKEN[];
}
export { Scanner, TOKEN, TOEKN_TYPE, };
