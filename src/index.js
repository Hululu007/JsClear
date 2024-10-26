const { clear, CodeEval, ast2js } = require('./JsClear/index');

const { readFile, writeFile } = require('./Tools/file_handler');
const { LOG } = require('./Tools/log');
const { Stats } = require('./Tools/stats');

jsClear = {
    clear,
    ast2js,
}

tools = {
    readFile,
    writeFile,
}

module.exports = {
    jsClear, 
    tools,
    LOG,
    CodeEval,
    Stats,
};