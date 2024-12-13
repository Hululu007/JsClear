import { Path } from "./Path";
declare class Environment {
    static environmentTypes: string[];
    static cache: WeakMap<Path, Environment>;
    path: Path;
    parentEnvironment: Environment | null;
    definePaths: Array<Path> | null;
    constructor(path: Path, parentEnvironment: Environment | null);
    clearCache(): void;
    defineVariable(path: Path): void;
    findVariable(name: string): Path | null;
}
export { Environment };
