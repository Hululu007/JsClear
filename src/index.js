const { clear } = require('./JsClear/clear');
const { CodeEval } = require('./JsClear/execute');

const { readFile, writeFile } = require('./Tools/file_handler');
const { LOG } = require('./Tools/log');
const { TypeStats } = require('./Tools/type_stats');

jsClear = {
    clear,
    CodeEval,
}

tools = {
    readFile,
    writeFile,
    TypeStats,
    LOG,
}

module.exports = {
    jsClear, 
    tools,
    LOG,
};