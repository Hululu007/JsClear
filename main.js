const traverse = require('@babel/traverse').default;
const parser = require("@babel/parser").parse;
const generator = require("@babel/generator").default;
const fs = require('fs');

const { debug } = require('./src/utiles.js');
const { traverse: myTraverse } = require("./src/traverse.js")

const data = fs.readFileSync('example/test.js', 'utf8');

let ast = parser(data)
// traverse(ast, {
//     CallExpression(path)
//     {
//         path.toString()

//     }
// })


myTraverse(ast)