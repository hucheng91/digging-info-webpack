/*
 * @Author: hucheng
 * @Date: 2019-08-10 14:21:23
 * @Description: AsyncSeriesHook Demo
 */

// const {
// 	AsyncSeriesHook
//  } = require("tapable");

 const {
	AsyncSeriesHook
 } = require("../my-tapable");

 const hook = new AsyncSeriesHook(['name']);

 // callback(error)
 hook.tap('1',(name,callback) => {
     setTimeout(() => {
        console.log('Hello',name);
        callback()
     },1000)
    
 })
 hook.tap('2',(name,callback) => {
    setTimeout( () => {
        console.log('Wellocome',name);
        callback(null)
    },2000)
    
 })

hook.tap('3',(name,callback) => {
    console.log('Happy',name);
   // console.log(callback.toString())
    callback()
})

hook.callAsync('hucheng',function(){
    console.log('finish',...arguments)
});