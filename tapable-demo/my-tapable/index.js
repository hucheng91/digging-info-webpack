/*
 * @Author: hucheng
 * @Date: 2019-08-11 14:38:04
 * @Description: here is des
 */





const  SyncHook  = require('./SyncHook')
const  SyncWaterfallHook = require('./SyncWaterfallHook')
const  SyncBailHook  =  require('./SyncBailHook')
const  SyncLoopHook  = require('./SyncLoopHook')
const  AsyncSeriesHook  =  require('./AsyncSeriesHook')
const  AsyncSeriesBailHook =  require('./AsyncSeriesBailHook')
const  AsyncParallelHook  =  require('./AsyncParallelHook')


module.exports =   {
    SyncHook,
    SyncWaterfallHook,
    SyncBailHook,
    SyncLoopHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncParallelHook
}
