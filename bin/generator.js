"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.node2js = node2js;
exports.js2node = js2node;
const parser_1 = require("@babel/parser");
const generator_1 = __importDefault(require("@babel/generator"));
function node2js(node, opts = { comments: true, retainLines: false, jsescOption: { minimal: true } }) {
    if (node["type"] && node["type"] == 'CommentLine')
        return `//${node["value"]}`;
    let { code } = (0, generator_1.default)(node, opts);
    return code;
}
function js2node(js, ops = {}) {
    let node = (0, parser_1.parse)(js, ops);
    return node["program"];
}
