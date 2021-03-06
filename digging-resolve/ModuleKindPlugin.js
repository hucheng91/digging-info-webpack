/*
 * @Author: hucheng
 * @Date: 2019-09-01 10:45:32
 * @Description: here is des
 */


module.exports = class ModuleKindPlugin {
	constructor(source, modules, target) {
		this.source = source;
		this.modules = modules;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver.getHook(this.source).tapAsync("ModuleKindPlugin", (request, callback) => {
			if (!request.module) {
				return callback(null, request);
			}
			// TODO: 粗略处理，这个在Window上路径会有些问题
			let array = request.path.split("/")
			array.splice(array.length - 1, 0, this.modules)
			request.path = array.join("/")
			const obj = Object.assign({}, request);

			resolver.doResolve(target, obj, (err, result) => {
				if (err) return callback(err);

				// Don't allow other alternatives
				if (result === undefined) return callback(null, null);
				callback(null, result);
			});
		});
	}
};
