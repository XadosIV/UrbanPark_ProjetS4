function Range(min, max) {
	var len = max - min + 1;
	var arr = new Array(len);
	for (var i=0; i<len; i++) {
		arr[i] = min + i;
	}
	return arr;
}

module.exports = {Range};