const { clear } = require('./clear');
const { CodeEval } = require('./execute');
const { ast2js } = require('./generator');


module.exports = {
	clear,
    CodeEval,
    ast2js
};