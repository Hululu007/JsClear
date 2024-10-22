class CodeEval {
    constructor(initCode)
    {
        this.initCode = initCode;
        this.addCode = '';
    }

    add(code)
    {
        this.addCode += (code + ';');
    }

    clearAddCode()
    {
        this.addCode = '';
    }

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
