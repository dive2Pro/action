const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser())
app.use(express.static(__dirname + '/public'))
const server = http.Server(app)
const sio = require('socket.io')(server)

server.listen(3000)

let host
let currentSong
let users = {}
let count = 0

sio.on('connection', socket => {

    function broadcast(type, msg) {
        socket.broadcast.emit(type, msg)
    }
    socket.on('join', (name, fn) => {
        users[name] = socket
        socket.nickname = name
        broadcast('broadcast', {msg: `${socket.nickname} are joined!`})
        fn(Date.now())
    })

    socket.on('message', (msg, fn) => {
        broadcast('msg', { msg: msg, name: socket.nickname })
        fn(Date.now())
    })

    socket.on('typing', data => {
        broadcast('typing', socket.nickname)
    })

    socket.on('search', data => {

    })

    socket.on('song', data => {

    })

    socket.on('disconnect', data => {
        broadcast('broadcast', { msg: `${socket.id} is leaved !`})
    })

    // confirm text was send
    socket.on('text', data => {

    })
})



