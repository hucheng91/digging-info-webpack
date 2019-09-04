/*
 * @Author: hucheng
 * @Date: 2019-09-04 09:43:51
 * @Description: here is des
 */
module.exports = class ResultPlugin {
	constructor(source) {
		this.source = source;
	}

	apply(resolver) {
		const sourceHook = resolver.ensureHook(this.source);
		sourceHook.tapAsync(
			"ResultPlugin",
			(request, callback) => {
				const obj = { ...request };
				resolver.hooks.result.callAsync(obj, err => {
					if (err) return callback(err);
					callback(null, obj);
				});
			}
		);
	}
};
