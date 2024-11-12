// babel解析的js节点类型
// https://github.com/estree/estree/blob/master/es5.md#blockstatement
// https://babel.nodejs.cn/docs/babel-parser/

// 判断是否是 node 节点
function isNode(n) {
    if (getTypes(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

function traverse(ast)
{
    if (ast.type != "Program" && ast.type != "File") {
        throw new Error("不是一个完整的 ast");
    }

    let keys = Object.keys(ast);
    for (let key of keys)
    {
        if (isNode(ast[key]))
        {
            
        }
    }
}