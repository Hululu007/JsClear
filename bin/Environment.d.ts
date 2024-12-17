import { Path } from "./Path";
declare class Environment {
    static environmentTypes: string[];
    static cache: WeakMap<Path, Environment>;
    path: Path;
    parentEnvironment: Environment | null;
    varPaths: Set<Path>;
    constructor(path: Path, parentEnvironment: Environment | null);
    clearVarPaths(): void;
    static clearCache(): void;
    defineVariable(path: Path): void;
    findVariable(name: string): Path | null;
}
export { Environment };
