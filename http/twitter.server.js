const http = require('http')
const qs = require('querystring')

http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
        res.writeHead('200')
        const obj = qs.parse(body)
        console.log(`Got name : ${obj.name}`)
    })
}).listen(3000)

