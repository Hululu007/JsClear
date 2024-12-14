"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteDir = void 0;
exports.writeFile = writeFile;
exports.readFile = readFile;
exports.deleteFile = deleteFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 递归创建文件夹
function mkdirsSync(dirPath) {
    let dirs = path_1.default.normalize(dirPath).split(path_1.default.sep);
    let currentDirPath = '';
    dirs.forEach((dir) => {
        if (dir) {
            currentDirPath += dir + path_1.default.sep;
            if (!fs_1.default.existsSync(currentDirPath)) {
                fs_1.default.mkdirSync(currentDirPath);
            }
        }
    });
}
function readFile(filePath, encoding = 'utf8') {
    const data = fs_1.default.readFileSync(filePath, encoding);
    return data;
}
function writeFile(filePath, data) {
    let dirPath = path_1.default.dirname(filePath);
    mkdirsSync(dirPath);
    fs_1.default.writeFileSync(filePath, data);
}
function deleteFile(filePath) {
    fs_1.default.unlinkSync(filePath);
}
// 连续创建文件
class WriteDir {
    constructor(dir, defaulfName = "", type = ".txt") {
        if (typeof dir != "string")
            throw new Error("传入类型有误！");
        this.dir = dir;
        this.defaulfName = defaulfName;
        this.type = type;
        this.writeCount = 0;
    }
    mkdirsSync(dirPath) {
        let dirs = path_1.default.normalize(dirPath).split(path_1.default.sep);
        let currentDirPath = '';
        dirs.forEach((dir) => {
            if (dir) {
                currentDirPath += dir + path_1.default.sep;
                if (!fs_1.default.existsSync(currentDirPath)) {
                    fs_1.default.mkdirSync(currentDirPath);
                }
            }
        });
    }
    writeFile(filePath, data) {
        let dirPath = path_1.default.dirname(filePath);
        this.mkdirsSync(dirPath);
        fs_1.default.writeFileSync(filePath, data);
    }
    write(data, name) {
        if (name == undefined) {
            this.writeCount++;
            name = this.defaulfName + "_" + this.writeCount;
        }
        else {
            this.defaulfName = name;
            this.writeCount = 0;
        }
        let filePath = path_1.default.join(this.dir, name) + this.type;
        this.writeFile(filePath, data);
    }
}
exports.WriteDir = WriteDir;
