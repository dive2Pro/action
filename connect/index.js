const http = require('http')
const fs = require('fs')
const connect = require('connect')
const requestTimeMiddleware = require('./middlewares/request.timer')


const server = connect()

function logger(req, res, next) {
    console.log('  %s  %s  ', req.method, req.url)
    next()
}
server.use(logger);
server.use(requestTimeMiddleware({ time: 300 }))


function serverAssets(res, next, pathUrl) {
    if(fs.stat(pathUrl, (err, stat) => {
        if (err || !stat.isFile()) {
            return next(' not found ')
        }
        const stream = fs.createReadStream(pathUrl)
        stream.pipe(res)
    }));
}
server.use((req, res, next) => {
    if('GET' === req.method && '/images' == req.url.substr(0, 7)) {
        // 托管图片
        serverAssets(res, next, __dirname + '/' + req.url )
    } else {
        next()
    }
})

server.use((req, res, next) => {
    if('GET' == req.method && '/' == req.url) {
        // 响应 html
        serverAssets(res, next, __dirname + '/website/index.html')
    } else {
        next()
    }
})

server.use((req, res, next) => {
    res.writeHead(404)
    res.end('Not Found')
})

http.createServer(server).listen(3000)
