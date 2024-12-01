// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

const { getType } = require('./utiles.js');
const { node2js } = require("./generator.js");
const { Environment } = require("./Environment.js");
const { VISITOR_KEYS } = require("@babel/types");

// 判断是否是 node 节点
function isNode(n) {
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

// 不同的node对Environment产生不同的影响
function updateEnvironment(node, visit, environment)
{
    let isSkip = false;

    if ("BlockStatement" == node.type)                  // 递归解析环境
    {
        traverse(node["body"], visit, environment);
        isSkip = true;
    }
    else if ("ForOfStatement" == node.type || "ForStatement" == node.type)  // 遇见for循环新开一个环境
    {
        // 初始化的let作用域
    }
    else if ("VariableDeclaration" == node.type)        // 定义变量，环境中记录位置
    {
        let variableDeclarators = node["declarations"];
        for (let i = 0; i < variableDeclarators.length; ++i)
        {
            environment.define(variableDeclarators[i]["id"]["name"], node);
        }
    }
    else if ("AssignmentExpression" == node.type)       // 赋值变量，环境中记录位置
    {
        environment.assign(node2js(node["left"]), node);
    }

    return isSkip;
}

// 收集接下来要访问的node
function collectNextNodesToVisit(node, stack)
{
    let keys = VISITOR_KEYS[node.type];
    for (let i = keys.length - 1; i >= 0; --i)
    {
        let child = node[keys[i]];

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

// 遍历ast
function traverse(root, visit, parentEnvironment = null)
{
    const stack = [];
    if (Array.isArray(root))    // 如果是数组就倒着入栈，以保证顺序不变
    {
        for (let i = root.length - 1; i >= 0; --i)
        {
            stack.push(root[i]);
        }
    }
    else 
    {
        if (root["type"] == 'File') root = root["program"];
        stack.push(root);
    }

    let environment = new Environment(parentEnvironment);

    while (stack.length > 0)
    {
        let node  = stack.pop();
        if (!isNode(node)) throw Error("遇到一个不是node的值");
        
        // 访问
        visit(node);
        console.log(node.type, node2js(node));

        // 更新环境
        let isSkip = updateEnvironment(node, visit, environment);
        if (isSkip)
        {
            if (stack.length == 0) break; 
            else continue;
        }

        // 收集子节点
        collectNextNodesToVisit(node, stack);
    }

    console.log(environment);
}

module.exports = {
	traverse,
};