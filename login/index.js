const http = require('http')
const path = require('path')
const connect = require('connect')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const favicon = require('serve-favicon')
const expressSession = require('express-session')

const morgan = require('morgan')
const middlewares = [
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    }),
    bodyParser(),
    cookieParser(),
    // cookieSession({
    //     name: 'cookieSession',
    //     keys: ['my secret'],
    //     maxAge: 24 * 60 * 60 * 1000
    // }),
    favicon(path.join('..', 'logo.png')),
    expressSession({
        secret: ' my secret'
    })]
const app = connect()
middlewares.forEach((ware) => app.use(ware))

function checkLogin(req, res, next) {
    console.log(req. url , ' ==== req.url')
    if( '/' == req.url && req.session.logged_in) {
        console.log(req.url, req.session)
        res.writeHead(200, { 'Content-Type': 'text/html'})
        res.end(`
            Welcome back, <b> ${req.session.name} </b>
            <a href="/logout">Logout</a>
        `)
    } else {
        next()
    }
}

function loginIn(req, res, next) {
    if('/' == req.url && 'GET' == req.method) {
        res.writeHead(200, { 'Content-Type': 'text/html'})
        res.end(`
        <form action='/login' method="post">
            <fieldset>
                <legend>Please log in</legend>
                <p>User: <input type="text" name="user"></p>
                <p>Password: <input type="password" name="password"></p>
                <button>Submit</button>
            </fieldset>
        </form>
        `)
    }else {
        next()
    }
}

const users = {
    david: {
        name: 'david',
        password: 'qwe'
    }
}
function handleLoginIn(req, res, next) {
    if('/login' == req.url && 'POST' == req.method) {
        if(!users[req.body.user] || req.body.password !=users[req.body.user].password) {
            res.writeHead(302, {
                Location: 'localhost:3000'
            })
            res.end()
            // res.end('Bad username / password')
        } else {
            res.writeHead(200)
            req.session.logged_in = true
            req.session.name = users[req.body.user].name
            console.log(req.session)
            res.end('Authenticated')
        }
    } else {
        next()
    }
}

function handleLogout(req, res, next) {
    if('/logout' == req.url) {
        req.session.logged_in = false
        res.writeHead(200)
        res.end('Logged out!')
    } else {
        next()
    }
}

app.use(checkLogin)
app.use(loginIn)
app.use(handleLoginIn)
app.use(handleLogout)

http.createServer(app).listen(3000)
