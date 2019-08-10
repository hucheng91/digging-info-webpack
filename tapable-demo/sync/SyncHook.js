const {
	SyncHook
 } = require("tapable");


 const hook = new SyncHook(['name']);

 hook.tap('1',(name) => {
     console.log('hello',name);
 })
 hook.tap('2',(name) => {
    console.log('Wellocome',name);
})


hook.call('hucheng');