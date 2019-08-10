/*
 * @Author: hucheng
 * @Date: 2019-08-10 14:21:23
 * @Description: AsyncSeriesHook Demo
 */

const {
	AsyncSeriesWaterfallHook
 } = require("tapable");


 const hook = new AsyncSeriesWaterfallHook(['name']);

 // callback(error,result)
 hook.tapAsync('1',(name,callback) => {
     console.log('Hello',name);
     callback()
 })
 hook.tapAsync('2',(name,callback) => {
    console.log('Wellocome',name);
    console.log(callback.toString())
    callback(null,2)
 })

hook.tapAsync('3',(name,callback) => {
    console.log('Happy',name);
   // console.log(callback.toString())
    callback()
})


hook.callAsync('hucheng',function(){
    console.log('finish',...arguments)
});