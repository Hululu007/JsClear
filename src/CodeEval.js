
const { randomName } = require("./utiles.js")
const { writeFile, deleteFile } = require("./fileControl.js")

class CodeEval 
{
    constructor(initCode="")
    {
        this.initCode = initCode;
        this.addCode = "";
    }

    /**
     * 添加代码
     * @param {string} code 
     */
    add(code)
    {
        this.addCode += (code + ';');
    }

    /**
     * 清楚添加的代码
     */
    clearAddCode()
    {
        this.addCode = '';
    }

    /**
     * 创建一个独立的环境执行
     * @param {string} returnVar 
     * @returns {object}
     */
    evalCode(returnVar)
    {
        let fileName = randomName("file");
        let relativePath = `./src/${fileName}.js`;
        let funcName = randomName("codeEval");

        let func;
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

module.exports = { 
    CodeEval
};
