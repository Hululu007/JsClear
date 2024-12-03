// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType, isNode } = require('./utiles.js');
const { Environment } = require("./Environment.js");
const { Path } = require("./Path.js");
const { VISITOR_KEYS } = require("@babel/types");
const { hasTraitNode } = require("./traitNode.js");
const { Log } = require("./Log.js");

let log = new Log(true);

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
    if (!isNode(node)) throw new Error("非node节点");
    if (null == path) path = new Path(node, path);
    
    log.label(path.type, path + "")

    // 判断和访问
    if (hasTraitNode(node, traitNode)) visit(path);

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