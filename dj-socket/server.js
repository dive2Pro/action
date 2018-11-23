const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const request = require('superagent')

const app = express()
app.use(bodyParser())
app.use(express.static(__dirname + '/public'))
const server = http.Server(app)
const sio = require('socket.io')(server)

server.listen(3000)

let host
let currentSong
let users = []
let count = 0

sio.on('connection', socket => {

    function broadcast(type, msg) {
        socket.broadcast.emit(type, msg)
    }

    function elect(nextSocket) {
        if (!host) {
            host = nextSocket
            broadcast('broadcast', {msg: `${nextSocket.nickname} is the new dj!`})
            nextSocket.emit('dj')
        }
    }

    socket.on('join', (name, fn) => {
        users.push(socket)
        socket.nickname = name
        socket._index = count++
        broadcast('broadcast', {msg: `${socket.nickname} are joined!`})
        fn(Date.now())
        elect(socket)
    })

    socket.on('message', (msg, fn) => {
        broadcast('msg', {msg: msg, name: socket.nickname})
        fn(Date.now())
    })

    socket.on('typing', data => {
        broadcast('typing', socket.nickname)
    })

    socket.on('search', (q, fn) => {
        request('http://tinysong.com/s' + encodeURIComponent(q))
            .query({key: apiKey, format: 'json'})
            .end((err, res) => {

            })
    })

    socket.on('song', data => {

    })

    socket.on('disconnect', () => {
        users.splice(socket._index, 1)
        if (host == socket) {
            host = null
            broadcast('broadcast', {msg: `dj is leaved !`})
            if (users.length) {
                elect(users.shift())
            }
        } else {
            broadcast('broadcast', {msg: `${socket.id} is leaved !`})
        }

    })

})



