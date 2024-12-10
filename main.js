const types = require("@babel/types");

const { debug } = require('./src/utiles.js');
const { traverse } = require("./src/traverse.js")
const { node2js, js2node } = require('./src/generator.js');
const { WriteDir, writeFile, readFile } = require("./src/fileControl.js")
const { CodeEval } = require('./src/CodeEval.js');  
const { NameNote } = require('./src/NameNote.js'); 
const { isTraitNode } = require('./src/traitNode.js'); 

let data = readFile('example/ld.js');
let ast = js2node(data)

let traitNode, visit;
let wd = new WriteDir("./data", 'ld', '.js');
let local = new NameNote("local");

traitNode = {
    type: "VariableDeclarator"
}
visit = function(path)
{
    let temp = local.new();
    let node = path.node;
    node.id.name = temp;

    for (let i of path.findReference())
    {
        i.node.name = temp;
    }
}
traverse(ast, traitNode, visit);
data = node2js(ast);
wd.write(data);
ast = js2node(data);

traitNode = {
    type: "ForStatement"
}
visit = function(path)
{
    let node = path.node;
    if (node["body"]["type"] != "BlockStatement")
    {
        node["body"] = js2node("{" + node2js(node["body"]) + "}")["body"][0]
    }
}
traverse(ast, traitNode, visit);

let rightTraitNode_1 = {
    type: "LogicalExpression",
    left: {
        type: "BinaryExpression",
    },
    operator: "&&",
    right: {
        type: "SequenceExpression",
    }
}

let rightTraitNode_2 = {
    type: "SequenceExpression",
}

traitNode = {
    type: "LogicalExpression",
    operator: "||",
}
let code = ''
let begin
visit = function(path)
{
    let node = path.node;
    if (isTraitNode(node.right, rightTraitNode_2))
    {
        begin = path;
        code = "else {" + node2js(node.right) + "}";
    }
    else if (isTraitNode(node.right, rightTraitNode_1))
    {
        code = "else if (" + node2js(node.right.left) + ")" + "{" + node2js(node.right.right) + "}" + code;
    }

    if (isTraitNode(node.left, rightTraitNode_1))
    {
        code = "if (" + node2js(node.left.left) + ")" + "{" + node2js(node.left.right) + "}" + code;
        begin.replaceWith(js2node(code)["body"][0]);
    }
}
traverse(ast, traitNode, visit);
wd.write(node2js(ast));


traitNode = {
    type: "StringLiteral",
    extra: {

    }
}
visit = function(path)
{
    let node = types.stringLiteral(path.node.value);
    path.replaceWith(node);

}
traverse(ast, traitNode, visit)

wd.write(node2js(ast));