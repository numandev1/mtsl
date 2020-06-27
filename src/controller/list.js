require('colors');
var columnify = require('columnify');
var links = require('../utils/links.js');

const list = () => {
	links.load();

	console.log('Links:');
	let data = [];
	for (var linkId in links.data) {
		var link = links.data[linkId];
		data.push({id: linkId.yellow, src: link.src.white, dst: link.dest.green});
	}
	if (data.length) {
		var columns = columnify(data);
		console.log(columns);
	} else {
		console.log('(no links set)');
	}
};

export {list};
