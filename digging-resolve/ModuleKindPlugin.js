/*
 * @Author: hucheng
 * @Date: 2019-09-01 10:45:32
 * @Description: here is des
 */


module.exports = class ModuleKindPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver.getHook(this.source).tapAsync("ModuleKindPlugin", (request, callback) => {
			//if (!request.module) return callback(null, request);
			const obj = Object.assign({}, request);
			delete obj.module;
			resolver.doResolve(target, obj, (err, result) => {
				if (err) return callback(err);

				// Don't allow other alternatives
				if (result === undefined) return callback(null, null);
				callback(null, result);
			});
		});
	}
};
