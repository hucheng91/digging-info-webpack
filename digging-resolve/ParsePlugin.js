/*
 * @Author: hucheng
 * @Date: 2019-09-01 10:42:23
 * @Description: here is des
 */


module.exports = class ParsePlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver.getHook(this.source).tapAsync("ParsePlugin", (request, callback) => {
			const parsed = resolver.parse(request.request);
			const obj = Object.assign({}, request, parsed);
			if (request.query && !parsed.query) {
				obj.query = request.query;
			}
			resolver.doResolve(target, obj, callback);
		});
	}

};
