const generator = require("@babel/generator").default;
const parser = require("@babel/parser").parse;

function node2js(node, opts = { comments: true, retainLines: false , jsescOption: { minimal: true }})
{
    if (node["type"] && node["type"] == 'CommentLine') return `//${node["value"]}`

    let { code } = generator(node, opts);
    return code
}

function js2node(js, ops = {})
{
    let node = parser(js, ops);
    return node["program"];
}

module.exports = {
    node2js,
    js2node,
};