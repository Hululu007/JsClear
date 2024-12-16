import { getType, isNode }  from "./utiles";
import { Node }  from "./Path";
import { Scanner }  from "./Scanner";
import { Parser, ParserResult }  from "./Parser";

interface ParserCache
{
    [scannerStr: string]: ParserResult
}
// 解析结果的缓存
let parseCache: ParserCache = {};

// 检查是否有需要解析的特殊符号
function isNeadParse(type: string)
{
    for (let c of Scanner.typeChars)
    {
        if (type.includes(c)) return true;
    }
    return false;
}

function check(nodeType: string, parserResult: ParserResult)
{
    let union = parserResult.union;
    let complement = parserResult.complement;

    if (union.length != 0 && complement.length != 0) throw new Error("并集与补集不能共存，如果你确实需要共存，可以联系我修改.");
    else if (union.length != 0)
    {
        for (let type of union)
        {
            if (type == nodeType) return true;
        }
        return false;
    }
    else
    {
        for (let type of complement)
        {
            if (type == nodeType) return false;
        }
        return true;
    }
}

// 检查类型是否相等
function checkType(nodeType: string, traitNodeType: string)
{
    if (typeof traitNodeType != "string") throw new Error("传入的类型不是字符串.");
    if (traitNodeType == '*') return true;
    if (!isNeadParse(traitNodeType)) return nodeType == traitNodeType;

    let scanner = new Scanner(traitNodeType);
    let tokens = scanner.getTokens();

    let scannerStr = Scanner.getString(tokens);
    let parserResult: ParserResult =  parseCache[scannerStr];
    if (parserResult == undefined)
    {   
        let parser = new Parser(tokens);
        parserResult = parser.getResult();
    }
    return check(nodeType, parserResult);
}

// 解析traitNode中的数组
function parseArray(nodeArray: Array<Node | null>, traitNodeArray: Array<Node | null | number>)
{
    if (traitNodeArray.length % 2 != 0) new Error("传入的traitNode格式不对.");

    for (let i = 0; i < traitNodeArray.length; i += 2)
    {
        let index = traitNodeArray[i];
        let traitNode = traitNodeArray[i + 1];

        if (isNode(traitNode))
        {
            if (!isTraitNode(nodeArray[index as number] as Node, traitNode as Node)) return false;
        }
        else
        {
            if (nodeArray[index as number] != traitNode) return false;
        }
    }

    return true;
}

// 解析traitNode中的不包含子node的object
function parseObject(node: { [key: string]: any }, traitNode: { [key: string]: any } )
{
    for (let key in traitNode) 
    {
        if (traitNode[key] != node[key]) return false;
    }

    return true;
}

// 判断是否符合特征
function isTraitNode(node: Node, traitNode: Node) {
    if (!isNode(traitNode)) throw new Error("传入的特征节点不是node");

	if (!checkType(node['type'], traitNode['type'])) return false;   // 提升效率

	// 判断除去 node 节点的属性
	for (let key in traitNode) 
    {
        if ('type' == key) continue;
		if (node[key] == undefined) return false;                   // 提升效率

		if (!isNode(traitNode[key])) 
        {
			// 不包含子node的object
			if (getType(traitNode[key]) == 'object')
            {
                 if (!parseObject(node[key], traitNode[key])) return false;
			} 
            else if (getType(traitNode[key]) == 'array') 
            {
                if (!parseArray(node[key], traitNode[key])) return false;
			} 
            else 
            {
				if (traitNode[key] != node[key]) return false;
			}
		} 
        else 
        {
			// 递归判断子树
            if (!isTraitNode(node[key], traitNode[key])) return false;
		}
	}

	return true;
}

export {
	isTraitNode,
};