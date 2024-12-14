declare function readFile(filePath: string, encoding?: BufferEncoding): string;
declare function writeFile(filePath: string, data: string): void;
declare function deleteFile(filePath: string): void;
declare class WriteDir {
    private dir;
    private defaulfName;
    private type;
    private writeCount;
    constructor(dir: string, defaulfName?: string, type?: string);
    mkdirsSync(dirPath: string): void;
    writeFile(filePath: string, data: string): void;
    write(data: string, name: string): void;
}
export { WriteDir, writeFile, readFile, deleteFile };
