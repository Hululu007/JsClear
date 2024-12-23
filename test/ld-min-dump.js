const types = require("@babel/types");

const { Tools, JsClear } = require('./bin/index.js'); 
const  { CodeEval, NameNote, WriteDir, writeFile, readFile } = Tools;
const  { isTraitNode, node2js, js2node, traverse } = JsClear;


let data = readFile('example/ld-mid.js');
let ast = js2node(data)

let traitNode;
let wd = new WriteDir("./data/ld-mid", 'ld', '.js');
let local = new NameNote("local");

// 改名
traverse(ast, { type: "VariableDeclarator" }, (path) => {
    let temp = local.new();
    let node = path.node;
    
    for (let i of path.findReference())
    {
        i.node.name = temp;
    }
    node.id.name = temp;
});
data = node2js(ast);
wd.write(data);
ast = js2node(data);

// 字符串编码
traverse(ast, { type: "StringLiteral" }, (path) => {
    let node = types.stringLiteral(path.node.value);
    path.replaceWith(node, true);
})

// for
traitNode = {
    type: "ForStatement",
    body: {
        type: "!BlockStatement"
    }
};
traverse(ast, traitNode, (path) =>
{
    path.get("body").replaceWith(js2node("{" + node2js(path.node["body"]) + "}")["body"][0], false);
});
wd.write(node2js(ast));
let currentTest;
traverse(ast, { type: "SequenceExpression | ForStatement" }, (path) => {
    if (path.type == "SequenceExpression")
    {
        let expressions = path.node["expressions"];
        for (let expression of expressions)
        {
            if (expression["type"] == "LogicalExpression") return;
        }
        let assignNode = {
            type: "AssignmentExpression",

            left: {
                type: "Identifier",
                name: currentTest
            }
        }
        let strNode = {
            type: "StringLiteral",
            value: ""
        }
        for (let expression of expressions)
        {
            if (!isTraitNode(expression, assignNode) && !isTraitNode(expression, strNode) && expression["type"] != "UnaryExpression")
            {
                console.log(node2js(expression));
            }
        }
        
    }
    else
    {
        let forNode = {
            type: "ForStatement",
            test: {
                type: "Identifier"
            }
        }
        if (isTraitNode(path.node, forNode))
        {
            currentTest = path.node["test"]["name"];
        }
        else
        {
            debugger;
        }
    }
});
wd.write(node2js(ast));


