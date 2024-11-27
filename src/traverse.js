// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType } = require('./utiles.js');
const { node2js } = require("./generator.js");
const { Environment } = require("./Environment.js");

// 判断是否是 node 节点
function isNode(n) {
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

// 不同的node对Environment产生不同的影响
function updateEnvironment(environment, node)
{

}

// 遍历ast
function traverse(root, visit)
{
    if (!isNode(root)) throw Error("输入的变量不是node");
    if (root["type"] == 'File') root = root["program"];

    const stack = [root];
    const environment = new Environment();

    while (stack.length > 0)
    {
        const node = stack.pop();
        let current = updateEnvironment(environment, node);
        
        // visit(node);
        console.log(node2js(node));
        

        let keys = Object.keys(node);
        for (let key of keys)
        {
            let child = node[key];

            // 先处理数组
            if (Array.isArray(child))
            {
                for (let index = child.length - 1; index >= 0; --index)
                {
                    if (isNode(child[index]))
                    {
                        stack.push(child[index]);
                    }
                }
            }
            else if (isNode(child))
            {
                stack.push(child);
            }
        }
    }
}

module.exports = {
	traverse,
};