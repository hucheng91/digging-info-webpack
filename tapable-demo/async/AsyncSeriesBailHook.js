/*
 * @Author: hucheng
 * @Date: 2019-08-10 14:21:23
 * @Description: AsyncSeriesHook Demo
 */

const {
	AsyncSeriesBailHook
 } = require("tapable");


 const hook = new AsyncSeriesBailHook(['name']);

 hook.tapAsync('1',(name,callback) => {
    setTimeout(() => {
        console.log('Hello',name);
        callback()
     },1000)
 })
 hook.tapAsync('2',(name,callback) => {
    setTimeout( () => {
        console.log('Wellocome',name);
        callback()
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