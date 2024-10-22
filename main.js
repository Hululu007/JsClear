const generator = require("@babel/generator").default;
const parser = require("@babel/parser").parse;

let jsCode = `
let a = [122, 2222, 1113];

for (let aa of a)
{
    console.log(aa)
}
`
let ast = parser(jsCode)
let res = JSON.stringify(ast)
function ast2js(ast, opts = { comments: false, retainLines: true })
{
    let { code } = generator(ast, opts);
    return code
}

js = ast2js(JSON.parse(res))
console.log()