/**
 * 请求时间中间件
 * @param {Object} opts
 * @param opts.time - 超时阀值
 */
module.exports = function (opts) {
    var time = opts.time || 100
    return function (req, res, next) {
        const timer = setTimeout(() => {
            console.log('%s , %s taking to long', req.method, req.url)
        }, time)
        const end = req.end
        req.end = function(chunk, encoding) {
            res.end = end ;
            res.end(chunk, encoding)
            clearTimeout(timer)
        }
        next()
    }
}

