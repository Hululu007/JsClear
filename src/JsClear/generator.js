const generator = require("@babel/generator").default;
const types = require("@babel/types");

function ast2js(ast, opts = { comments: false, retainLines: true })
{
    let { code } = generator(ast, opts);
    return code
}

module.exports = {
    ast2js
};