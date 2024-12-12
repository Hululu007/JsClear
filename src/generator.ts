import { parse } from "@babel/parser";
import generator from "@babel/generator";

function node2js(node: any, opts={ comments: true, retainLines: false , jsescOption: { minimal: true }})
{
    if (node["type"] && node["type"] == 'CommentLine') return `//${node["value"]}`

    let { code } = generator(node, opts);
    return code
}

function js2node(js: string, ops = {})
{
    let node = parse(js, ops);
    return node["program"];
}

export {
    node2js,
    js2node,
};