"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeEval = void 0;
const fileControl_1 = require("./fileControl");
const utiles_1 = require("./utiles");
class CodeEval {
    constructor(initCode = "") {
        this.initCode = initCode;
        this.addCode = "";
    }
    add(code) {
        this.addCode += (code + ';');
    }
    clearAddCode() {
        this.addCode = '';
    }
    evalCode(returnVar) {
        if (typeof returnVar != "string")
            throw new Error("传入的类型需要时字符串");
        let fileName = (0, utiles_1.randomName)("file");
        let relativePath = `./src/${fileName}.js`;
        let funcName = (0, utiles_1.randomName)("codeEval");
        let func = () => { console.log("默认"); };
        let code = `
function ${funcName}()
{
    ${this.initCode + ';' + this.addCode};
    return ${returnVar};
}

module.exports = { 
    ${funcName}
};`;
        (0, fileControl_1.writeFile)(relativePath, code);
        eval(`const { ${funcName} } = require("./" + "${fileName}" + ".js"); func = ${funcName}`);
        (0, fileControl_1.deleteFile)(relativePath);
        return func();
    }
}
exports.CodeEval = CodeEval;
