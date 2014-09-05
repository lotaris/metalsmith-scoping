"use strict";

var marked = require('marked');
var debug = require('debug')('metalsmith-scoping');

module.exports = function(opts) {

	opts = opts || {};
	opts.privateProcess = opts.privateProcess || function(value) { return value; };
	opts.publicProcess = opts.publicProcess || function(value) { return value; };

	if (opts.marked) {
		marked.setOptions(opts.marked);
	}

	debug('scope = %s', opts.scope);
	return function(files, metalsmith, done) {
		var ext;
		// check if whole file is private
		for (var filepath in files) {
			if (files.hasOwnProperty(filepath)) {
				if (opts.scope !== 'private' && files[filepath].private === true) {
					debug('Removing private file %s', filepath);
					delete files[filepath];
				} else {
					ext = filepath.split('.').pop().toLowerCase();
					if (ext === 'md') {
						var contents = files[filepath].contents.toString();
						var fct = opts.scope === 'public' ? opts.publicProcess : opts.privateProcess;
						files[filepath].contents = new Buffer(fct(contents));
					}
				}
			}
		}
		done();
	};
};
