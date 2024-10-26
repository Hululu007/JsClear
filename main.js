const types = require("@babel/types");

const { jsClear, tools, LOG, CodeEval, Stats } = require("./src/index")

let jsCode = tools.readFile("./example/zhihu.js")


let pass1 = []
pass1[0] = {
    type: "IfStatement",
    consequent: {
        type: "ReturnStatement"
    }
}

pass1[1] = 
/**
* @param {import('@babel/traverse').NodePath} path
*/
function(path) {
    console.log(path.get("consequent") + "")
}

let pass2 = []

pass2[0] = {
    type: "IfStatement",
    consequent: {
        type: "BlockStatement",
        body:
        [

        ]
    }
}

pass2[1] = 
/**
* @param {import('@babel/traverse').NodePath} path
*/
function(path)
{
    for (let bb of path.get("consequent").get("body"))
    {
        if (bb["type"] != "IfStatement") LOG(bb["type"], bb + "");
    }
}

let pass3 = []
let stats =  new Stats()
pass3[0] = {
    type: "IfStatement",
    test: {
        type: "BinaryExpression",
        left: {
            type: "MemberExpression",
            object: {
                type: "ThisExpression",
            },
            property: {
                type: "StringLiteral",
                value: "w"
            }
        },
        operator: "<="
    }
}

pass3[1] = 
/**
* @param {import('@babel/traverse').NodePath} path
*/
function(path) {
    let binaryExpressionPath = path.get("test")
    LOG("debug", binaryExpressionPath.node.operator)
    LOG("debug", binaryExpressionPath.get("right").node.value)
}

jsClear.clear(jsCode, [ pass3 ])
console.log()