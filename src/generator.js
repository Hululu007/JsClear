const generator = require("@babel/generator").default;
const parser = require("@babel/parser").parse;

function node2js(node, opts = { comments: true, retainLines: false })
{
    if (node["type"] && node["type"] == 'CommentLine') return `//${node["value"]}`

    let { code } = generator(node, opts);
    return code
}

function js2node(js, ops = {})
{
    return parser(js, ops)
}

module.exports = {
    node2js,
    js2node,
};