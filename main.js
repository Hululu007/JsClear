const types = require("@babel/types");

const { Tools, JsClear } = require('./bin/index.js'); 
const  { CodeEval, NameNote, WriteDir, writeFile, readFile } = Tools;
const  { node2js, js2node, traverse } = JsClear;


let data = readFile('example/ld-conzhitai.js');
let ast = js2node(data);

let local = new NameNote("local");
let writeDir = new WriteDir("./data/ld-conzhitai", "id", ".js");

traverse(ast, { type: "Identifier" }, (path) => {
    if (path.isVarNode())
    {
        let name = local.new()
        for (let reference of path.findReference())
        {
            reference.node["name"] = name;
        }
        path.node["name"] = name;
    }
});

writeDir.write(node2js(ast));
