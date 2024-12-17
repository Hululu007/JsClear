import { Path, Node } from "./Path";
type VisitPath = (path: Path) => void;
declare function traverse(node: Node, traitNode: Node, visit: VisitPath): void;
export { traverse, };
