/*
 * @Author: hucheng
 * @Date: 2019-07-06 16:06:40
 * @Description: here is des
 */
// const {
// 	AsyncParallelHook
//  } = require("tapable");

 const {
	AsyncParallelHook
 } = require("../my-tapable/index")


 const hook = new AsyncParallelHook(['name']);

// callback(error)
 hook.tap('1',(name, callback) => {
     setTimeout(() => {
        console.log('Hello',name);
        callback()
     },1000)
 })
 hook.tap('2',(name, callback) => {

    console.log('Wellocome',name);
    callback()
    
})
hook.tap('3',(name, callback) => {
    setTimeout(() => {
        console.log('Happy',name);
        callback()
    },3000)
})


hook.callAsync('hucheng',function(){
    console.log('finish',...arguments)
});