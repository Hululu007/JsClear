import crypto from 'crypto';

// 获取数据类型
function getType(target: any): string
{
    if (Array.isArray(target)) return 'array';
    else if (target && target.buffer) return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)  return 'null';

    return typeof target;
}

// 标签打印
function debug(label="", message=""): void
{
    if (label != "" && message == "")
    {
        console.log(label);
    }
    else
    {
        console.log(`[${label}] ${message}`);
    }
}

// 随机生成名字
function randomName(prefix="random"): string
{
    const randomBytes = crypto.randomBytes(8);
    const randomHex = randomBytes.toString('hex');
    return `${prefix}_${randomHex}`;
}


// 判断是否是 node 节点
function isNode(n: any): boolean
{
    if (getType(n) != 'object' || n['type'] == undefined) return false;
    else return true;
}


export {
	getType,
    debug,
    isNode,
    randomName,
};
