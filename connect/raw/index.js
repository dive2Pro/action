var http = require('http')
var fs = require('fs')


var server = http.createServer((req, res) => {
    const { method, url } = req
    const isGet = method === 'GET'
    const isImageRequest = url.indexOf('.jpg') > -1
    function resNotFound() {
        res.writeHead(404)
        res.end('Not Found')
    }
    if(isGet && isImageRequest) {
        res.writeHead(200, {"Content-Type": "application/image"})
        const pathUrl = __dirname  + '/' + url
        if(fs.stat(pathUrl, (err, stat) => {
            if(err || !stat.isFile()) {
                return resNotFound
            }
            const stream = fs.createReadStream(pathUrl)
            stream.pipe(res)
        })
    } else if(url === '/'){
        res.writeHead(200, 'text/html')
        res.end(`
            <h1>Hello</h1>
            <img src="/images/2.jpg"/>
        `)
    } else {
        resNotFound()
    }
})

server.listen(3000, () => {
    console.log('listening: 3000')
})
