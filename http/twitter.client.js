const http = require('http')
const qs = require('querystring')

const search = process.argv.slice(2).join(' ').trim()

if(!search) {
    return console.log(`\n  Usage: node tweets <search term> \n`)
}

console.log(` searching for : ${search}`)

const stdin = process.stdin
const stdout = process.stdout

function send(theName) {
    const req = http.request({
        host: 'search.twitter.com',
        path: '/1.1/search/tweets.json?' + qs.stringify({q: theName}),
        timeout: 5000
        // 下面两个是默认的字段
        // port: 80,
        // method: 'GET'
    }, res => {
        var body = ''
        res.setEncoding('utf8')
        res.on('data', chunk => body += chunk)
        res.on('end', () => {
            const obj = JSON.parse(body)
            obj.results.forEach( tweet => {
                console.log(`${tweet.text}`)
                console.log(`${tweet.from_user}`)
                console.log(' -- ')
            })
        })
        res.on('error', error => {
            console.error(error)
        })
    })
    req.on('error', err => {
        console.log(err)
    })
    req.end(qs.stringify({ name: theName }))
}


stdout.write('\n your name : ')
stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data' , name => {
    send(name.replace('\n', ''))
})
