import { Path, Node } from "./Path";
type VisitCallBack = (path: Path) => void;
type DealWithPath = (path: Path, traitNode: Node, visit: VisitCallBack) => void;
declare function _traverse(path: Path, traitNode: Node, visit: VisitCallBack, dealWithPath: DealWithPath, isNewPathSetSkip: boolean): void;
declare function traverse(node: Node, traitNode: any, visit: VisitCallBack): void;
export { traverse, _traverse, };
