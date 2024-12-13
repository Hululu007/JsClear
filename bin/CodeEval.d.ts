declare class CodeEval {
    private initCode;
    private addCode;
    constructor(initCode?: string);
    add(code: string): void;
    clearAddCode(): void;
    evalCode(returnVar: string): void;
}
export { CodeEval };
