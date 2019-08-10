/*
 * @Author: hucheng
 * @Date: 2019-07-06 15:44:29
 * @Description: here is des
 */
const { SyncLoopHook } = require('tapable');

const syncLoopHook = new SyncLoopHook([ 'nam1', 'nam2']);

let count1 = 2;
syncLoopHook.tap('1', (name) => {
    console.log('Hello ', name);
   while(count1 > 0) {
        --count1;
        return true;
    }
});

syncLoopHook.tap('2', (name) => {
    console.log('Welcome ', name);
});



syncLoopHook.call('Alice');