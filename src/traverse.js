// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType } = require('./utiles.js');
const { Environment } = require("./Environment.js");
const { Path } = require("./Path.js");
const { VISITOR_KEYS } = require("@babel/types");

// 判断是否是 node 节点
function isNode(n) {
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

// 处理
function visitQueue(queue, traitNode, visit)
{
    for (let index = 0; index < queue.length; index++)
    {
        let path = queue[index];
        traverse(path.node, traitNode, visit, path)
    }
}

// 完善path然后交给visitQueue处理
function visitNodeArray(nodeArray, traitNode, visit, parentPath)
{
    let queue = [];
    for (let key = 0; key < nodeArray.length; ++key)
    {
        let path = new Path(nodeArray[key], parentPath);
        queue.push(path);
    }
    visitQueue(queue, traitNode, visit);
}

// 遍历ast
function traverse(node, traitNode, visit, path=null)
{
    if (node["type"] == 'File') node = node["program"];
    if (null == path) path = new Path(node, path);

    // traitNode, visit
    visit(path);
    console.log(path.type, path + "");
    

    const keys = VISITOR_KEYS[node["type"]];
    for (const key of keys)
    {
        let childNodeArray = node[key];
        if (!childNodeArray) continue;

        if (!Array.isArray(childNodeArray)) childNodeArray = [childNodeArray];
        visitNodeArray(childNodeArray, traitNode, visit, path);
    }
}

module.exports = {
	traverse,
};