/*
 * @Author: hucheng
 * @Date: 2019-09-05 13:15:04
 * @Description: here is des
 */
/*
MIT License http://www.opensource.org/licenses/mit-license.php
Author Tobias Koppers @sokra
*/
"use strict";

const DescriptionFileUtils = require("./DescriptionFileUtils");

module.exports = class DescriptionFilePlugin {
	constructor(source, filenames, target) {
		this.source = source;
		this.filenames = [].concat(filenames);
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver.getHook(this.source).tapAsync("DescriptionFilePlugin", (request, callback) => {
			const directory = request.path + "/node_modules";
			DescriptionFileUtils.loadDescriptionFile(resolver, directory, this.filenames, {}, (err, result) => {
				if (err) return callback(err);
				const relativePath = "." + request.path.substr(result.directory.length).replace(/\\/g, "/");
				const obj = Object.assign({}, request, {
					descriptionFilePath: result.path,
					descriptionFileData: result.content,
					descriptionFileRoot: result.directory,
					relativePath: relativePath
				});
				resolver.doResolve(target, obj, "using description file: " + result.path + " (relative path: " + relativePath + ")", (err, result) => {
					if (err) return callback(err);

					// Don't allow other processing
					if (result === undefined) return callback(null, null);
					callback(null, result);
				});
			});
		});
	}
};
