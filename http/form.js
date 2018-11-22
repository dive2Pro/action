var http = require('http')

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': "text/html"})
    var { url, method } = req
    if(url == '/') {
        var formHtml = `
        <form method="post" action="/url">
            <h1>Form</h1>
            <fieldset>
                <legend>Personal Information</legend>
                <p>What's your name</p>
                <input type="text" name="name">
            </fieldset>
            <p>
                <button type="submit">Submit</button>
            </p>
        </form>
    `
        res.end(formHtml)
    } else if(url === '/url' && method === 'POST') {
        // Node 允许数据在到达服务器的时候就可以对其进行处理
        // 数据 是以不同TCP包到达服务器的
        // 监听数据接收完全后, 再执行具体的操作
        var body = ''
        // node 自带模块, 用于解析请求内容
        var qs = require('querystring')
        req.on('data', chunk => {
            body += chunk
        })

        req.on('end' , () => {
            res.end(`
                <p>Content-Type: ${req.headers['content-type']} </p>
                <p>Data:</p> <pre>${qs.parse(body).name}</pre>
            `)
        })
   } else {
        // 请求头是可以复写的
        res.writeHead(404,)
        res.end('Not Found')
    }
})

server.listen(3000, function() {
    console.log('listening : 3000')
})
