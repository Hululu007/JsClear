/**
 * 获取目标类型
 * @param {*} target 
 * @returns 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
 */
function getType(target)
{
    if (Array.isArray(target)) return 'array';
    else if (target && target.buffer) return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)  return 'null';

    return typeof target;
}

/**
 * 清晰打印
 * @param {string} label 
 * @param {string} message 
 */
function debug(label="", message="")
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

module.exports = {
	getType,
    debug,
};