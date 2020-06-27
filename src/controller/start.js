require('colors');
var links = require('../utils/links.js');

const start = (id) => {
	if (id) {
		links.load();
		const link = links.data[id];
		if (!link) {
			console.error(`Error: could not find link ${id}`);
		} else {
			console.log(link, 'linklink');
		}
	} else {
		console.log('Please specfic id of link which you want to start'.red);
	}
};

export {start};
