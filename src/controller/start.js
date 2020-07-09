require('colors');
var links = require('../utils/links.js');
var fs = require('fs-extra');
const chokidar = require('chokidar');
const path = require('path');

//isStartwithoutadd will be true if user start by mtsl startwithoutadd
//linkObject will receive data when user start by mtsl startwithoutadd

const start = (id, isStartwithoutadd = false, linkObject = {}) => {
	try {
		if (id) {
			let link = {};
			if (isStartwithoutadd) {
				link = linkObject;
			} else {
				links.load();
				link = links.data[id];
			}

			if (!link) {
				console.error(`Error: could not find link ${id}`);
			} else {
				chokidar.watch(link.src).on('all', (event, eventPath) => {
					if (isAllowedThisPath(eventPath, link))
						switch (event) {
							case 'change':
								addOrChange(eventPath, link, 'CHANGE');
								break;
							case 'add':
								addOrChange(eventPath, link, 'ADD');
								break;
							case 'addDir':
								addDir(eventPath, link, 'ADD DIR');
								break;
							case 'unlink':
								unlinkOrUnlinkDir(eventPath, link, 'DELETE');
								break;
							case 'unlinkDir':
								unlinkOrUnlinkDir(eventPath, link, 'DELETE DIR');
								break;
						}
				});
			}
		} else {
			console.log('Please specfic id of link which you want to start'.red);
		}
	} catch (error) {
		console.log('something went wrong'.red);
	}
};

const checkIsParentOrSubDir = (parent, dir) => {
	if (parent === dir) return true;
	const relative = path.relative(parent, dir);
	return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};

const isAllowedThisPath = (eventPath, link) => {
	try {
		const sourceRelativePath = path.relative(link.src, eventPath);
		const mtslconfigFilePath = path.resolve(link.src, '.mtslconfig.json');
		if (fs.existsSync(mtslconfigFilePath)) {
			const mtslconfigFile = fs.readFileSync(mtslconfigFilePath, 'utf8');
			const mtslconfigFileJson = JSON.parse(mtslconfigFile);
			const ignore_dirs = mtslconfigFileJson.ignore_dirs;
			if (ignore_dirs) {
				if (ignore_dirs.length > 0) {
					for (let i = 0; i < ignore_dirs.length; i++) {
						if (checkIsParentOrSubDir(ignore_dirs[i], sourceRelativePath)) {
							return false;
						}
					}
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	} catch (error) {
		return true;
	}
	return true;
};

const logSrcDest = (src, dest, eventType) => {
	let color = 'green';
	switch (eventType) {
		case 'CHANGE':
			color = 'yellow';
			break;

		case 'ADD':
		case 'ADD DIR':
			color = 'green';
			break;

		case 'DELETE':
		case 'DELETE DIR':
			color = 'red';
			break;
	}

	console.log(`[${eventType}] `, src[color], '-->', dest[color]);
};

const getDestinationPath = (eventPath, link) => {
	const sourceRelativePath = path.relative(link.src, eventPath);
	const destinationAbsolutePath = path.resolve(link.dest, sourceRelativePath);
	return destinationAbsolutePath;
};

const addOrChange = (eventPath, link, eventType) => {
	const destinationPath = getDestinationPath(eventPath, link);
	fs.copySync(eventPath, destinationPath);
	logSrcDest(eventPath, destinationPath, eventType);
};

const addDir = (eventPath, link, eventType) => {
	const destinationPath = getDestinationPath(eventPath, link);
	fs.mkdirsSync(destinationPath);
	logSrcDest(eventPath, destinationPath, eventType);
};

const unlinkOrUnlinkDir = (eventPath, link, eventType) => {
	const destinationPath = getDestinationPath(eventPath, link);
	fs.removeSync(destinationPath);
	logSrcDest(eventPath, destinationPath, eventType);
};

export {start};
