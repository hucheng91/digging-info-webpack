/*
 * @Author: hucheng
 * @Date: 2019-07-06 16:12:36
 * @Description: here is des
 */
const {AsyncParallelBailHook} = require("tapable");


 const hook = new AsyncParallelBailHook(['name']);

 // callback(error,result)
 hook.tapAsync('1',(name,callback) => {
    console.log('hello',name);
   callback()
 })
 hook.tapAsync('2',(name,callback) => {
    console.log('Wellocome',name);
   // console.log(callback.toString())
   //callback()
   callback(null,123)
})
hook.tapAsync('3',(name,callback) => {
   console.log('Happy',name);
  // console.log(callback.toString())
  callback()
})




hook.callAsync('hucheng',function(){
   console.log('finish',...arguments)
});