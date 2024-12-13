interface Node {
    [key: string]: any;
    type: string;
}
declare class Path {
    node: Node;
    type: string;
    parentPath: Path | null;
    isSkip: boolean;
    private referencePaths;
    private childPath;
    static copy(from: Path, to: Path): void;
    constructor(node: Node, parentPath: Path | null, isSkip?: boolean);
    addReference(path: Path): void;
    clearReference(): void;
    getReferencePaths(): Path[] | undefined;
    setReferencePaths(referencePaths: Array<Path>): void;
    findReference(): void;
    replaceWith(node: Node, isSkip: boolean): void;
    toString(): string;
    get(key: string): any;
    set(key: string, path: Path): void;
    setArray(key: string, path: Array<Path>): void;
    clearChildPath(): void;
}
export { Path, Node };
