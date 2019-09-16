// @ts-nocheck
/*
 * @Author: hucheng
 * @Date: 2019-07-06 15:27:48
 * @Description: here is des
 */
const {
    SyncHook
} = require("tapable");

// const { SyncHook } = require("../my-tapable")

console.log(SyncHook)

const hook = new SyncHook(['name']);

// hook.intercept({
//     tap: (context, tapInfo) => {
// 		console.log(`${context} is doing it's job`);
//     },
//     call:(name) => {
//         console.log('call',name)
//     },
//     register: (tapInfo) => {
//         console.log('register',JSON.stringify(tapInfo))
// 		return tapInfo; // may return a new tapInfo object
// 	}
// })


class MyVue {
    constructor() {
        this.hooks = {
            beforeCreate: new SyncHook(["beforeCreateHook"]),
            created: new SyncHook(["createdHook"]),
            mounted: new SyncHook(),
            destroyed: new SyncHook(),
        };
    }
    beforeCreate() {
        console.log('准备初始化MyVue实例了')
        //....这里框架干了一堆事 ，就通过 hook 把使用者注入代码执行完成了
        this.hooks.beforeCreate.call('MyVue')
    }
    created() {
        console.log('干点其他事,唤起hook created ')
        this.hooks.created.call(this)
    }
    init() {
        //..... 干一堆事
        this.beforeCreate()
        //..... 再干一堆事
        this.created()
    }
}
const vueInstance = new MyVue()
vueInstance.hooks.beforeCreate.tap('1', (name) => {
    console.log('hello', name);
})
vueInstance.hooks.beforeCreate.tap('2', (name) => {
    console.log('Wellocome', name);
})
vueInstance.init()

