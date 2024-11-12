const parser = require("@babel/parser").parse;
const traverse = require('@babel/traverse').default;

const { writeFile } = require('../Tools/file_handler');
const { getTypes } = require('../Tools/get_types');
const { ast2js } = require('./JsClear/generator');

// 判断是否是 node 节点
function isNode(n) {
	if (getTypes(n) != 'object' || n['type'] == undefined) return false;
	else return true;
}

// 判断是否符合特征
function hasTraitNode(node, traitNode) {
	if (traitNode['type'] != node['type']) return false; // 提升效率

	// 判断除去 node 节点的属性
	for (let key in traitNode) 
    {
		if (node[key] == undefined) return false;

		if (!isNode(traitNode[key])) 
        {
			// object 对象单独处理
			if (getTypes(traitNode[key]) == 'object')
            {
				for (let secondaryKey in traitNode[key]) 
                {
					if (traitNode[key][secondaryKey] != node[key][secondaryKey]) return false;
				}
			} 
            else if (getTypes(traitNode[key]) == 'array') 
            {
				for (let i = 0; i < traitNode[key].length; ++i) 
                {
					// 可能会有 [, 1] 这样的
					if (traitNode[key][i] == null) 
                    {
						if (node[key][i] != null) return false;
					}
				}
			} 
            else 
            {
				if (traitNode[key] != node[key]) return false;
			}
		} 
        else 
        {
			// 递归判断子树
			if (hasTraitNode(node[key], traitNode[key]) == false) return false;
		}
	}

	return true;
}

// 遍历改变代码
function passCode(ast, traitNode, passFunc)
{
	traverse(ast, 
	{
		enter(path)
		{
			let node = path.node;
			if (hasTraitNode(node, traitNode))
			{
                try 
				{
                    passFunc(path);
                } 
				catch (error) 
				{
                    console.error('pass failed:', path.toString());
                    console.error('parent path code:', path.parentPath.toString());

					throw error
                }
			}
		}
	});
}

// 检查 pass
function checkPass(nodeLocation, processFunction)
{
	if (getTypes(processFunction) != "function")
	{
		throw "传入的不是一个函数"
	}
}

// 清理代码
function clear(jsCode, nodeLocation, processFunction , filePath = "./data/clearResult.js")
{
	checkPass(nodeLocation, processFunction);

	let ret;
	let ast = parser(jsCode);

	ret = JSON.stringify(ast);

	try
	{
		passCode(ast, pass[0], pass[1]);
	}
	catch (error)
	{
		writeFile(filePath, ast2js(JSON.parse(ret)));
		throw error;
	}

	writeFile(filePath, ast2js(JSON.parse(ret)));
}

module.exports = {
	clear,
};