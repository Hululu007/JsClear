class CodeEval 
{
    constructor(initCode)
    {
        this.initCode = initCode;
        this.addCode = '';
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
        let ret;
        eval(this.initCode + ';' + this.addCode + ';' + `ret = ${returnVar};`);
        return ret;
    }
}

module.exports = { 
    CodeEval
};
