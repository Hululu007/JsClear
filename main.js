const traverse = require('@babel/traverse').default;
const types = require("@babel/types");
const fs = require('fs');

const { debug } = require('./src/utiles.js');
const { traverse: myTraverse } = require("./src/traverse.js")
const { Stats } = require('./src/Stats.js');
const { node2js, js2node } = require('./src/generator.js');

const data = fs.readFileSync('example/test.js', 'utf8');

// 测试代码
let a1 = new Stats();
let a2 = new Stats();
let num = 0;
let ast = js2node(data, {})
traverse(ast, {
    enter(path)
    {
        num++;
        a1.add(path.type)
    }
})

myTraverse(ast, {type: '*'}, (node) => { a2.add(node.type); num-- })

if (num != 0) debugger;
for (let key of Object.keys(a1.get()))
{
    if (a1.get()[key] != a2.get()[key]) console.log(key, a2.get()[key], a1.get()[key]);
}