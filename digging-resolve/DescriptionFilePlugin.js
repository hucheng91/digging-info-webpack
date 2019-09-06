/*
 * @Author: hucheng
 * @Date: 2019-09-05 13:15:04
 * @Description: here is des
 */

const DescriptionFileUtils = require("./DescriptionFileUtils");

module.exports = class DescriptionFilePlugin {
	constructor(source, filenames) {
		this.source = source;
		this.filenames = [].concat(filenames);
	}

	apply(resolver) {
		resolver.getHook(this.source).tapAsync("DescriptionFilePlugin", (request, callback) => {
			const directory = request.path;
			DescriptionFileUtils.loadDescriptionFile(resolver, directory, this.filenames, {}, (err, result) => {
				if (err) return callback(err);
				const relativePath = "." + request.path.substr(result.directory.length).replace(/\\/g, "/");
				const obj = Object.assign({}, request, {
					descriptionFilePath: result.path,
					descriptionFileData: result.content,
					descriptionFileRoot: result.directory,
					relativePath: relativePath
				});
				obj.path = obj.path + "/" + obj.descriptionFileData.main;
				return callback(null, obj)
			});
		});
	}
};
