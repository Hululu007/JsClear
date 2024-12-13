declare function node2js(node: any, opts?: {
    comments: boolean;
    retainLines: boolean;
    jsescOption: {
        minimal: boolean;
    };
}): string;
declare function js2node(js: string, ops?: {}): import("@babel/types").Program;
export { node2js, js2node, };
