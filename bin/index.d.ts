import { isTraitNode } from "./traitNode";
import { node2js, js2node } from "./generator";
import { traverse } from "./traverse";
import { CodeEval } from "./CodeEval";
import { Stats } from "./Stats";
import { NameNote } from "./NameNote";
import { WriteDir, writeFile, readFile } from "./fileControl";
declare let Tools: {
    CodeEval: typeof CodeEval;
    Stats: typeof Stats;
    NameNote: typeof NameNote;
    WriteDir: typeof WriteDir;
    writeFile: typeof writeFile;
    readFile: typeof readFile;
};
declare let JsClear: {
    isTraitNode: typeof isTraitNode;
    node2js: typeof node2js;
    js2node: typeof js2node;
    traverse: typeof traverse;
};
export { Tools, JsClear };
