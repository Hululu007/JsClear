if (a == 1)
    console.log(1)


if (a == 2)
{
    console.log(22)
}

function isNode(n) {
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

// 遍历ast
function traverse(ast)
{
    let keys = Object.keys(ast);
    for (let key of keys)
    {
        if (isNode(ast[key]))
        {
            traverse(ast[key])
            console.log(node2js(ast[key]));
            
        }
    }
}
