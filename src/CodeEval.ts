import { writeFile, deleteFile } from "./fileControl";
import { randomName } from "./utiles";

class CodeEval 
{
    private initCode: string;
    private addCode: string;

    constructor(initCode="")
    {
        this.initCode = initCode;
        this.addCode = "";
    }

    add(code: string)
    {
        this.addCode += (code + ';');
    }

    clearAddCode()
    {
        this.addCode = '';
    }

    evalCode(returnVar: string)
    {
        if (typeof returnVar != "string") throw new Error("传入的类型需要时字符串")

        let fileName = randomName("file");
        let relativePath = `./src/${fileName}.js`;
        let funcName = randomName("codeEval");

        let func = () => { console.log("默认"); };
        let code = `
function ${funcName}()
{
    ${this.initCode + ';' + this.addCode};
    return ${returnVar};
}

module.exports = { 
    ${funcName}
};`

        writeFile(relativePath, code);
        eval(`const { ${funcName} } = require("./" + "${fileName}" + ".js"); func = ${funcName}`)
        deleteFile(relativePath);
        return func();
    }
}

export { 
    CodeEval
};
