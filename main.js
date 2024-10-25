const types = require("@babel/types");

const {jsClear, tools, LOG} = require("./src/index")

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

jsClear.clear(jsCode, [ pass1, pass2 ])
console.log()