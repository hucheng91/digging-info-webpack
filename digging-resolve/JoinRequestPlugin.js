/*
 * @Author: hucheng
 * @Date: 2019-09-04 09:39:58
 * @Description: here is des
 */
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

module.exports = class JoinRequestPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("JoinRequestPlugin", (request, callback) => {
				const obj = {
					...request,
					path: resolver.join(request.path, request.request),
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, request.request),
					request: undefined
				};
				resolver.doResolve(target, obj, callback);
			});
	}
};
