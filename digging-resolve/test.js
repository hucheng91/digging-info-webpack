/*
 * @Author: hucheng
 * @Date: 2019-08-25 18:02:38
 * @Description: here is des
 */
const resolve = require("enhanced-resolve");
const CWD = process.cwd();

resolve(__dirname, './1.js', (error, result) => {
    console.log(result)
})
resolve(CWD, 'enhanced-resolve', (error, result) => {
    console.log(result)
})