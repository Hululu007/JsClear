const generator = require("@babel/generator").default;
const types = require("@babel/types");

function node2js(node, opts = { comments: true, retainLines: false })
{
    if (node["type"] && node["type"] == 'CommentLine') return `//${node["value"]}`

    let { code } = generator(node, opts);
    return code
}

module.exports = {
    node2js
};