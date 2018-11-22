var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res) {

    // 它将所有的头信息都变成了小写
    console.log(req.headers)
    // 会默认添加两个请求头:
    //      Connection: keep-alive -> Node 告诉浏览器 始终保持连接, 通过它发送更多的请求,
    //                                     避免 TCP 协议的频繁创建关闭所造成的资源浪费
    //      Transfer-Encoding: chunked  -> 意味着这个请求的资源响应时是逐步产生的
    //                                      这也是 Node 天生的异步机制
    res.writeHead(200, { 'Content-Type': "text/html"})
    res.end('Hello <b>World</b>')
})
var imgServer = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type' : 'image/png' })
    var stream = fs.createReadStream('demo.jpg')
    // stream.on('data', function(data) {
    //     res.write(data)
    // })
    // stream.on('end', function() {
    //     res.end()
    // })

    // 流是Node 中非常重要的一个概念, req, res 都是 Stream, 通过 pipe 可以连接在一起使用
    stream.pipe(res)
})
imgServer.listen(3000, function() {
    console.log('listening : 3000')
})
