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
     console.log('Hello',name);
    // console.log(callback.toString())
     callback(null,123)
 })
 hook.tapAsync('2',(name,callback) => {
    console.log('Wellocome',name);
  //  console.log(callback.toString())
    callback('12344')
 })

hook.tapAsync('3',(name) => {
    console.log('Happy',name);
})


hook.callAsync('hucheng',function(){
    console.log('finish',...arguments)
});