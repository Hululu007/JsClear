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
    referencePaths: Array<Path> | undefined;
    constructor(node: Node, parentPath: Path | null, environment: Environment | null, isSkip?: boolean);
    toString(): string;
    isTraitNode(traitNode: Node): boolean;
    replaceWith(node: Node, isSkip: boolean): void;
    get(key: string): Path | any;
    findReference(): void;
    isVarNode(): boolean;
    initReference(): void;
}
export { Path, Node };
