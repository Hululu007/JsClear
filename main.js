const types = require("@babel/types");

const { Tools, JsClear } = require('./bin/index.js'); 
const  { CodeEval, NameNote, WriteDir, writeFile, readFile } = Tools;
const  { isTraitNode, node2js, js2node, traverse } = JsClear;


let data = readFile('example/ld-mid.js');
let ast = js2node(data)

let traitNode;
let wd = new WriteDir("./data/ld-min", 'ld', '.js');
let local = new NameNote("local");

// 改名
traitNode = {
    type: "VariableDeclarator"
}
traverse(ast, traitNode, (path) => {
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
traitNode = {
    type: "StringLiteral",
}

traverse(ast, traitNode, (path) => {
    let node = types.stringLiteral(path.node.value);
    path.replaceWith(node, true);
})
wd.write(node2js(ast));

// for
traitNode = {
    type: "ForStatement",
    body: {
        type: "!BlockStatement"
    }
}
traverse(ast, traitNode, (path) =>
{
    path.get("body").replaceWith(js2node("{" + node2js(path.node["body"]) + "}")["body"][0], false);
    console.log(path + "");
    
});

traitNode = {
    type: "LogicalExpression",
    operator: "||",
}
let code = ''
let begin;
traverse(ast, traitNode, (path) => {

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

    let node = path.node;
    if (isTraitNode(node.right, rightTraitNode_2))
    {
        code = "else {" + node2js(node.right) + "}";
        begin = path;
    }
    else if (isTraitNode(node.right, rightTraitNode_1))
    {
        code = "else if (" + node2js(node.right.left) + ")" + "{" + node2js(node.right.right) + "}" + code;
    }

    if (isTraitNode(node.left, rightTraitNode_1))
    {
        code = "if (" + node2js(node.left.left) + ")" + "{" + node2js(node.left.right) + "}" + code;
        begin.replaceWith(js2node(code)["body"][0], false);
        console.log(code);
        
    }
});
wd.write(node2js(ast));


