const types = require("@babel/types");

const { debug } = require('./src/utiles.js');
const { traverse } = require("./src/traverse.js")
const { node2js, js2node } = require('./src/generator.js');
const { WriteDir, writeFile, readFile } = require("./src/fileControl.js")
const { CodeEval } = require('./src/CodeEval.js');  

const data = readFile('example/ld.js');
let ast = js2node(data, {})

let traitNode, visit;
let wd = new WriteDir("./data", 'ld', '.js');

traitNode = {
    type: "VariableDeclarator"
}

visit = function(path)
{
    console.log(path.findReference());
}

traverse(ast, traitNode, visit)
