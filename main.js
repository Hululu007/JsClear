const traverse = require('@babel/traverse').default;
const parser = require("@babel/parser").parse;
const generator = require("@babel/generator").default;
const fs = require('fs');

const { debug } = require('./src/utiles.js');
const { traverse: myTraverse } = require("./src/traverse.js")
const { Stats } = require('./src/Stats.js');

let a1 = new Stats();
let a2 = new Stats();

const data = fs.readFileSync('example/test.js', 'utf8');
let num = 0;
let ast = parser(data)
traverse(ast, {
    enter(path)
    {
        num++;
        a1.add(path.type)
    }
})

myTraverse(ast, (node) => { a2.add(node.type); num-- })

if (num != 0) debugger;
for (let key of Object.keys(a1.get()))
{
    if (a1.get()[key] != a2.get()[key]) console.log(key, a2.get()[key], a1.get()[key]);
}