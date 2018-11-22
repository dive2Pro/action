const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser())
app.use(express.static(__dirname + '/public'))
const server = http.Server(app)
const sio = require('socket.io')(server)

server.listen(3000)
sio.on('connection', socket => {
    console.log('---')
})



