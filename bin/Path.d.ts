import { Environment } from "./Environment";
interface Node {
    [key: string]: any;
    type: string;
}
declare class Path {
    node: Node;
    type: string;
    parentPath: Path | null;
    isSkip: boolean;
    environment: Environment | null;
    private referencePaths;
    constructor(node: Node, parentPath: Path | null, environment: Environment | null, isSkip?: boolean);
    toString(): string;
    replaceWith(node: Node, isSkip: boolean): void;
    get(key: string): Path | any;
    addReference(path: Path): void;
    clearReference(): void;
    getReferencePaths(): Path[] | undefined;
    setReferencePaths(referencePaths: Array<Path>): void;
    findReference(): void;
}
export { Path, Node };
