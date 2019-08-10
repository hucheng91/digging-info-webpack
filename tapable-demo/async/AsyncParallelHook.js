/*
 * @Author: hucheng
 * @Date: 2019-07-06 16:06:40
 * @Description: here is des
 */
const {
	AsyncParallelHook
 } = require("tapable");


 const hook = new AsyncParallelHook(['name']);

// callback(error)
 hook.tapAsync('1',(name, callback) => {
     setTimeout(() => {
        console.log('Hello',name);
        callback()
     },1000)
  
 })
 hook.tapAsync('2',(name, callback) => {

    console.log('Wellocome',name);
    console.log(callback.toString())
    callback()
    
})

hook.tapAsync('3',(name, callback) => {
    console.log('Happy',name);
    //console.log(callback.toString())
    callback()
})


hook.callAsync('hucheng',function(){
    console.log('finish',...arguments)
});