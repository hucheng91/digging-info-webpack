// @ts-nocheck
/*
 * @Author: hucheng
 * @Date: 2019-07-06 15:27:48
 * @Description: here is des
 */
// const {
// 	SyncHook
// } = require("tapable");

const {SyncHook} = require("../my-tapable/SyncHook")

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
hook.tap('1',(name) => {
    console.log('hello',name);
})
hook.tap('2',(name) => {
    console.log('Wellocome',name);
})


hook.call('hucheng');