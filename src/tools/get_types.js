// 获取数据类型
function getTypes(value) {
	// 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
	if (Array.isArray(value)) {
		return 'array';
	}
	if (value && (value.buffer || value instanceof ArrayBuffer)) {
		return 'arraybuffer';
	}
	if (value == null) {
		return 'null';
	}
	return typeof value;
}

module.exports = {
	getTypes,
};