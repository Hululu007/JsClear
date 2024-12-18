import { isTraitNode } from "./traitNode";
import { node2js, js2node } from "./generator";
import { traverse } from "./Traverse";

import { CodeEval } from "./CodeEval";
import { Stats } from "./Stats";
import { NameNote } from "./NameNote";
import { WriteDir, writeFile, readFile }  from "./fileControl";


let Tools = { CodeEval, Stats, NameNote, WriteDir, writeFile, readFile };
let JsClear = { isTraitNode, node2js, js2node, traverse };

export { Tools, JsClear }