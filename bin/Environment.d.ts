import { Path } from "./Path";
declare class Environment {
    static loopTypes: string[];
    static functionTypes: string[];
    static environmentTypes: string[];
    path: Path;
    parentEnvironment: Environment | null;
    varPaths: Set<Path>;
    constructor(path: Path, parentEnvironment: Environment | null);
    clearVarPaths(): void;
    defineVariable(path: Path): void;
    findVariable(name: string): Path | null;
}
export { Environment };
