/*
 * @Author: hucheng
 * @Date: 2019-08-28 09:24:36
 * @Description: here is des
 */
const { SyncHook, SyncBailHook, AsyncSeriesBailHook } = require("tapable");
const memoryFsJoin = require("memory-fs/lib/join");
const memoizedJoin = new Map();
const REGEXP_NOT_MODULE = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
const REGEXP_DIRECTORY = /[\/\\]$/i;

function withName(name, hook) {
    hook.name = name;
    return hook;
}
module.exports = class Resolve {
    constructor() {
        this.hooks = {
            noResolve: withName("noResolve", new SyncHook(["request"])),
            resolve: withName("resolve", new AsyncSeriesBailHook(["request"])),
            'parsed-resolve': withName('parsed-resolve', new AsyncSeriesBailHook(['request'])),
            'described-resolve': withName('parsed-resolve', new AsyncSeriesBailHook(['request'])),
            'after-described-resolve': withName('after-described-resolve', new AsyncSeriesBailHook(['request'])),
            'raw-module': withName('raw-module', new AsyncSeriesBailHook(['request']))

        }
    }
    /**
     * 
     * @param {*} path 
     * @param {*} request 
     * @param {*} callback 
     */
    resolve(path, request, callback) {
        const obj = {
            path,
            request
        }
        this.doResolve(this.hooks.resolve, obj, callback)
    }
    doResolve(hook, request, callback) {
        return hook.callAsync(request, (err, result) => {
            if (err) return callback(err);
            if (result) return callback(null, result);
            callback();
        })
    }

    ensureHook(name) {

        const hook = this.hooks[name];
        if (!hook) {
            return this.hooks[name] = withName(name, new AsyncSeriesBailHook(["request", "resolveContext"]));
        }
        return hook;
    }
    parse(identifier) {
        if (identifier === "") return null;
        const part = {
            request: "",
            query: "",
            module: false,
            directory: false,
            file: false
        };
        const idxQuery = identifier.indexOf("?");
        if (idxQuery === 0) {
            part.query = identifier;
        } else if (idxQuery > 0) {
            part.request = identifier.slice(0, idxQuery);
            part.query = identifier.slice(idxQuery);
        } else {
            part.request = identifier;
        }
        if (part.request) {
            part.module = this.isModule(part.request);
            part.directory = this.isDirectory(part.request);
            if (part.directory) {
                part.request = part.request.substr(0, part.request.length - 1);
            }
        }
        return part;
    }

    isModule(path) {
        return !REGEXP_NOT_MODULE.test(path);
    }
    join(path, request) {
        let cacheEntry;
        let pathCache = memoizedJoin.get(path);
        if (typeof pathCache === "undefined") {
            memoizedJoin.set(path, pathCache = new Map());
        } else {
            cacheEntry = pathCache.get(request);
            if (typeof cacheEntry !== "undefined")
                return cacheEntry;
        }
        cacheEntry = memoryFsJoin(path, request);
        pathCache.set(request, cacheEntry);
        return cacheEntry;
    }
    isDirectory(path) {
        return REGEXP_DIRECTORY.test(path);
    }
    getHook(name) {
        const hook = this.hooks[name];
        if (!hook) {
            throw new Error(`Hook ${name} doesn't exist`);
        }
        return hook;
    }
}