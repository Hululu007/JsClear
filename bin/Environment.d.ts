import { Path } from "./Path";
declare class Environment {
    static environmentTypes: string[];
    static notEnvironmentTypes: string[];
    static specialEnvTypes: string[];
    parentEnvironment: Environment | null;
    varPaths: Set<Path>;
    unVarPaths: Map<string, Path>;
    constructor(parentEnvironment: Environment | null);
    clearVarPaths(): void;
    defineVariable(path: Path): void;
    findVariable(name: string): Path | null;
}
export { Environment };
