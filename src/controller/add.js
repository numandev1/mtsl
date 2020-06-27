var untildify = require('untildify');
var isThere = require('is-there');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var links = require('../utils/links');

const add = (src, desc, skip) => {
	console.log(src, desc, 'ssss');

	links.load();
	var i,
		src = path.resolve(untildify(src)),
		dest = path.resolve(untildify(desc));

	for (i in links.data) {
		if (links.data[i].src === src && links.data[i].dest === dest) {
			console.log('Error: link already exists');
			return;
		}
	}
	const prompt = !skip
		? promptForIgnoredFolders(src, [
				{
					name: 'git',
					relPath: '.git',
					ignore: '.git',
					message:
						'Source folder is a git repo, add `.git` to ignored folders?',
					default: true
				},
				{
					name: 'npm',
					relPath: 'package.json',
					ignore: 'node_modules',
					message:
						'Source folder is an npm package, add `node_modules` to ignored folders?',
					default: true
				}
		  ])
		: Promise.resolve([]);

	prompt.then((ignoredFolders) => {
		var watchmanConfigPath = path.resolve(src, '.mtslconfig.json');

		var watchmanConfig = (() => {
			try {
				return fs.readJsonSync(watchmanConfigPath);
			} catch (err) {
				return {
					ignore_dirs: []
				};
			}
		})();

		ignoredFolders = ignoredFolders.concat(watchmanConfig.ignore_dirs);
		watchmanConfig.ignore_dirs = dedupeArray(ignoredFolders);

		fs.outputJsonSync(watchmanConfigPath, watchmanConfig);

		i = 0;
		while (links.data[i]) i++;

		links.data[i] = {
			src: src,
			dest: dest,
			createdTime: new Date()
		};

		links.save();
		console.log(`Added link: (${i}) ${src} -> ${dest}`);
	});
};

function promptForIgnoredFolders(src, rules) {
	var prompts = [];

	rules.forEach((rule) => {
		if (isThere(path.resolve(src, rule.relPath))) {
			prompts.push({
				name: rule.name,
				message: rule.message,
				default: rule.default,
				type: 'confirm'
			});
		}
	});
	return inquirer.prompt(prompts).then((answers) => {
		var ignoredFolders = [];

		rules.forEach((rule) => {
			if (answers[rule.name]) {
				ignoredFolders.push(rule.ignore);
			}
		});

		return ignoredFolders;
	});
}

function dedupeArray(array) {
	var arr = array.concat();

	for (var i = 0; i < arr.length; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i] === arr[j]) {
				arr.splice(j--, 1);
			}
		}
	}

	return arr;
}

export {add};
