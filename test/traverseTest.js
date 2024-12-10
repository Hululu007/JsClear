const traverse = require('@babel/traverse').default;
const parser = require("@babel/parser").parse;

const { WriteDir, writeFile, readFile } = require("../src/fileControl.js")
const { debug } = require('../src/utiles.js');
const { traverse: myTraverse } = require("../src/traverse.js")
const { Stats } = require('../src/Stats.js');
const { node2js, js2node } = require('../src/generator.js');

const data = readFile('./example/n1.js');

// 测试代码
let babelStats = new Stats();
let myStats = new Stats();
let num = 0;

let ast1 = js2node(data, {});
let ast2 = parser(data, {});

traverse(ast2, {
    enter(path)
    {
        num++;
        babelStats.add(path.type)
    }
})

myTraverse(ast1, {type: '*'}, (node) => { myStats.add(node.type); num-- })

if (num != 0) throw new Error("节点总数目不一样");

for (let key of Object.keys(babelStats.get()))
{
    if (babelStats.get()[key] != myStats.get()[key]) 
    {
        console.log(key, myStats.get()[key], babelStats.get()[key]);
        throw new Error("单个节点数目不一样");
    }
}

console.log("traverse函数测试成功");
