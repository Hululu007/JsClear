interface Node {
    [key: string]: any;
    type: string;
}
declare class Path {
    static varTypes: (string | undefined)[];
    node: Node;
    type: string;
    parentPath: Path | null;
    isSkip: boolean;
    referencePaths: Array<Path> | undefined;
    constructor(node: Node, parentPath: Path | null, isSkip?: boolean);
    toString(): string;
    isTraitNode(traitNode: Node): boolean;
    replaceWith(node: Node, isSkip: boolean): void;
    get(key: string): Path | any;
    findReference(): Path[];
    isVarNode(): boolean;
    initReference(): void;
}
export { Path, Node };
