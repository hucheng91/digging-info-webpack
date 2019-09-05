/*
 * @Author: hucheng
 * @Date: 2019-09-01 10:50:14
 * @Description: here is des
 */

const forEachBail = require("./forEachBail");
const fs = require("fs-extra")
function loadDescriptionFile(resolver, directory, filenames, resolveContext, callback) {
	(function findDescriptionFile() {
		forEachBail(filenames, (filename, callback) => {
			const descriptionFilePath = resolver.join(directory, filename);
			fs.readJSON(descriptionFilePath, (err, content) => {
				if (err) {
					if (typeof err.code !== "undefined") return callback();
					return onJson(err);
				}
				onJson(null, content);
			})
			function onJson(err, content) {
				if (err) {
					if (resolveContext.log)
						resolveContext.log(descriptionFilePath + " (directory description file): " + err);
					else
						err.message = descriptionFilePath + " (directory description file): " + err;
					return callback(err);
				}
				callback(null, {
					content: content,
					directory: directory,
					path: descriptionFilePath
				});
			}
		}, (err, result) => {
			if (err) return callback(err);
			if (result) {
				return callback(null, result);
			}
		});
	}());
}

exports.loadDescriptionFile = loadDescriptionFile;