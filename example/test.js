if (a == 1)
    console.log(1)


if (a == 2)
{
    console.log(22)
}

function isNode(n, b) {
    var a = 11;
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}

// 遍历ast
function traverse(ast)
{
    let keys = Object.keys(ast), a;
    lll = 111, aaa = 1;
  a.b = 1;
    for (let key of keys)
    {
        if (isNode(ast[key]))
        {
            traverse(ast[key])
            console.log(node2js(ast[key]));
            
        }
    }
}

() => {
}